goog.provide('todo.Bootstrapper');
goog.require('todo.ui.ToDoView');
goog.require('goog.debug.ErrorHandler');
goog.require('goog.events.EventHandler');



/**
 * @export
 * @constructor
 */
todo.Bootstrapper = function() {
    console.log('Bootstrapper');

    var toDoView = new todo.ui.ToDoView();
    toDoView.render(document.body);
}
