goog.provide('todo.ui.ToDoView');
goog.require('todo.ui.ToDoViewModel');
goog.require('tart.ui.DlgComponent');


/**
 * @constructor
 * @extends {tart.ui.DlgComponent}
 */
todo.ui.ToDoView = function() {
    this.model = new todo.ui.ToDoViewModel();

    goog.base(this);
};
goog.inherits(todo.ui.ToDoView, tart.ui.DlgComponent);


/**
 * @override
 */
todo.ui.ToDoView.prototype.bindModelEvents = function() {
    goog.events.listen(this.model, this.model.EventType.ITEMS_UPDATED, this.onItemsUpdated_, false, this);
};


todo.ui.ToDoView.prototype.onItemsUpdated_ = function() {
    var items = this.model.getItems();
    var itemsMarkup = items.map(this.templates_item, this).join('');
    this.getChild(this.mappings.ITEMS)[0].innerHTML = itemsMarkup;
    this.getChild(this.mappings.FOOTER)[0].innerHTML = this.templates_footer(this.model.getCheckedItemsCount());
};


/**
 * @override
 */
todo.ui.ToDoView.prototype.templates_base = function() {
    return '<view id="' + this.id + '">' +
        this.templates_content() +
        '</view>';
};


todo.ui.ToDoView.prototype.templates_content = function() {
    var items = this.model.getItems();
    var itemsMarkup = items.map(this.templates_item, this).join('');

    return '<h1>Today</h1>' +
            this.templates_inputField() +
            '<items>' + itemsMarkup + '</items>' +
            '<footer>' + this.templates_footer(this.model.getCheckedItemsCount()) + '</footer>';
};


todo.ui.ToDoView.prototype.templates_inputField = function() {
    return '<input-container>' +
            '<input type="text" placeholder="Type text and hit enter">' +
        '</input-container>'
};


todo.ui.ToDoView.prototype.templates_footer = function(checkedItemCount) {
    if (!checkedItemCount) return '';

    return 'Delete <strong>' + checkedItemCount + '</strong> completed tasks.';
};


todo.ui.ToDoView.prototype.templates_item = function(item, index) {
    return '<item data-index="' + index + '" class="' + item.state + '">' +
            '<item-delete><i class="icon-trash"></i></item-delete>' +
            '<item-text>' + item.text + '</item-text>' +
            '<item-state>' + this.templates_state(item) + '</item-state>' +
        '</item>'
};


todo.ui.ToDoView.prototype.templates_state = function(item) {
    if (item.state == 'normal')
        return '<i class="icon-check-false"></i>';
    else if (item.state == 'checked')
        return '<i class="icon-check-true"></i>';
};


todo.ui.ToDoView.prototype.onDeleteClick = function(e) {
    var element = e.getBrowserEvent().target;
    do {
        var index = element.getAttribute('data-index');
        var isItem = element.tagName == 'ITEM';
        if (isItem && index) {
            this.model.deleteItemByIndex(index);
            break;
        }
    } while ((element = element.parentElement));
};


todo.ui.ToDoView.prototype.onStateClick = function(e) {
    var element = e.getBrowserEvent().target;
    do {
        var index = element.getAttribute('data-index');
        var isItem = element.tagName == 'ITEM';
        if (isItem && index) {
            this.model.toggleStateByIndex(index);
            break;
        }
    } while ((element = element.parentElement));
};


todo.ui.ToDoView.prototype.onFooterClick = function(e) {
    this.model.deleteCheckedItems();
};

todo.ui.ToDoView.prototype.onInputKeyPres = function(e) {
    /**
     * When enter is hit, add the text as an item.
     */
    if (e.keyCode == 13) {
        var inputEl = this.getChild(this.mappings.INPUT)[0];
        var inputText = inputEl.value;
        this.model.addItem(inputText);
        inputEl.value = '';
    }
};


/**
 * @enum {string}
 */
todo.ui.ToDoView.prototype.mappings = {
    DELETE: 'item-delete',
    STATE: 'item-state',
    FOOTER: 'footer',
    INPUT: 'input-container input',
    ITEMS: 'items'
};


(function() {
    this.events = {};
    var keyPress = this.events[goog.events.EventType.KEYUP] = {};
    var click = this.events[goog.events.EventType.CLICK] = {};

    keyPress[this.mappings.INPUT] = this.onInputKeyPres;
    click[this.mappings.STATE] = this.onStateClick;
    click[this.mappings.DELETE] = this.onDeleteClick;
    click[this.mappings.FOOTER] = this.onFooterClick;
}).call(todo.ui.ToDoView.prototype);
