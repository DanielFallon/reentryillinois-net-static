var pagecounter = $.inherit(Module, {
    __constructor: function(div) {
        this.__base(div);
        this.type = "pagecounter";
    },


    loadModuleCallback: function(data, textStatus) {
        this.container.html(data.html);
        this.container.find(".counter").html( data.options.counternum );
        //this.initialize();
        this.addDragHandle(data);
    },

    initialize: function() {
        this.$counter = this.container.find(".counter");
        this.incrementCounter();
    },

    onIncrement: function(e) {
        var count = e.response.count;
        this.$counter.html(count);
    },

    incrementCounter: function() {
        this.ajaxPost("increment", createRef(this, this.onIncrement));
    }

});
