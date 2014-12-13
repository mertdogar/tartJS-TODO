goog.provide('todo.ui.ToDoViewModel');
goog.require('tart.ui.ComponentModel');



/**
 * @constructor
 * @extends {tart.ui.ComponentModel}
 */
todo.ui.ToDoViewModel = function() {
    goog.base(this);

    this.items = [];

    this.load();
};
goog.inherits(todo.ui.ToDoViewModel, tart.ui.ComponentModel);


todo.ui.ToDoViewModel.prototype.deleteItemByIndex = function(index) {
    this.items.splice(index, 1);
    this.dispatchEvent(this.EventType.ITEMS_UPDATED);

    this.save();
};


todo.ui.ToDoViewModel.prototype.toggleStateByIndex = function(index) {
    if (this.items[index].state == 'normal')
        this.items[index].state = 'checked';
    else
        this.items[index].state = 'normal';

    this.dispatchEvent(this.EventType.ITEMS_UPDATED);

    this.save();
};


todo.ui.ToDoViewModel.prototype.getCheckedItemsCount = function() {
    return this.items.filter(function(item) { return item.state == 'checked'; }).length;
};


todo.ui.ToDoViewModel.prototype.deleteCheckedItems = function() {
    this.items = this.items.filter(function(item) {
        return item.state != 'checked';
    });
    this.dispatchEvent(this.EventType.ITEMS_UPDATED);

    this.save();
};


todo.ui.ToDoViewModel.prototype.setItemState = function(index, state) {
    this.items[index].state = state;
    this.dispatchEvent(this.EventType.ITEMS_UPDATED);

    this.save();
};


todo.ui.ToDoViewModel.prototype.addItem = function(text) {
    this.items.push({
        text: text,
        state: 'normal'
    });

    this.dispatchEvent(this.EventType.ITEMS_UPDATED);

    this.save();
};


todo.ui.ToDoViewModel.prototype.getItems = function() {
    return this.items;
};


todo.ui.ToDoViewModel.prototype.save = function() {
    try {
        localStorage['items'] = JSON.stringify(this.items);
    } catch(exception) {
        console.log('Err: Cannot stringify the items array', exception);
    }
};


todo.ui.ToDoViewModel.prototype.load = function() {
    try {
        this.items = JSON.parse(localStorage['items']);
    } catch(exception) {
        console.log('Err: Cannot parse the items array', exception);
        this.items = [];
    }
};


/**
 * Event types for this model.
 *
 * @enum {string}
 */
todo.ui.ToDoViewModel.prototype.EventType = {
    ITEMS_UPDATED: 'iu'
};
