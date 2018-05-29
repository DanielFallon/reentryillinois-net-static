// Class for the Custom HTML module
var customhtml = $.inherit(Module, {
    __constructor: function(div) {

        this.__base(div);
        this.type = "Custom HTML";
        this.isResizing = true;
        this.isFloat = true;

        // If this is an old-style customHtml module, convert it to a new, instance-based customhtml module
        var thisId = this.element.attr('id');
        this.divType = 'module';

        if (thisId.indexOf('nonnative') != -1) {
            this.convertToNewStyle(this.container.get(0).innerHTML);
        }
    },

    loadModuleCallback: function(data)
    {
        if( !this.isPublished )
        {
            this.addDragHandle(data);
            if( $.trim( data.options.html ) === "" )
            {
                this.container.html( data.html );
            }
            else
            {
                var iframe = $( '<iframe>', {'id':'cf'+this.id, 'src':'/adm/zbl/mediamanager/cframe.php?id='+this.id, 'style':'width:100%'});
                this.container.empty().append( iframe );
            }
        }
    },


    // Send the HTML to the server to be saved in the database,
    // but only if they pass a server-side validation
    saveOptions: function(options) {
        var _this = this;

        // Send the html to the server to be validated
        var validationOpts = {};
        validationOpts.html = options['html'];

        $.post('/adm/ajax.php?m=' + this.id + '&a=validateHTML', validationOpts,
            function(data) {
                var d = eval('(' + data.response + ')');

                // If the validation returned a success, proceed to save the options
                if (d.isValid) {
                    // Show a 'saving' notification
                    var notifyBox = new NotifyBox();
                    notifyBox.show("Saving module...", "wait");

                    // Set standard options needed for updating things.
                    options['mod_id'] = _this.id;
                    options['mod_page'] = _EDITOR.getPage();
                    options['mod_uid'] = _this.uid;
                    options['newEditor'] = 1;

                    $.post('/adm/ajax.php?m=' + _this.id + '&a=setOptions', options, 
                        function(data) {
                            if (data) {
                                responseJSON = eval("(" + data.response + ")");

                                if (responseJSON != null && responseJSON.error) {
                                    notifyBox.show("XML Errors: " + responseJSON.error + "<br /><br /> Please reformat your custom HTML and try again.", "fail");
                                    notifyBox.finish();
                                }
                                else {
                                    notifyBox.show("Module Saved", "success");
                                    notifyBox.finish();

                                    if (data.options) {
                                        _this.setOptions(data.options.replace(/&quot;/gi, '"'));
                                    }

                                    // Reload the div contianing the module and indicate that we should perform post-save actions
                                    _this.setAJAXParams();
                                    _this.loadModule(data);
                                }
                            }
                            else {
                                notifyBox.show("An error occured saving" + SUPPORTLINK, "fail");
                                notifyBox.finish();
                            }
                        }, 
                    "json");
                }
                else {
                    // If the validation returned a failure, then show the errors in a modal box
                    var mb = new ModalBox({title: "Invalid HTML"});
                    var errors = '';

                    if (typeof d.errors == 'string') {
                        errors = '<li>' + d.errors + '</li>';
                    }
                    else {
                        for (e in d.errors) {
                            errors += '<li>' + d.errors[e].message + '(Line ' + d.errors[e].line + ')</li><br />';
                        }
                    }

                    mb.setHTML("<p>Sorry, but the HTML you wrote was invalid for the following reasons:</p><p><ul>" + errors + "</ul></p><p>Please reformat and submit again.</p>");
                    mb.addButton("OK", function() {
                        mb.close();
                         _this.draghandle.showCogOptions();
                    }, 'blue');
                    mb.open();
                }

            }, 'json'
        );
    },


    /* Fire off a few ajax calls to create a new customhtml module in the database
     * with information taken from this old-tyle customHtml nonnative module
     * oldHtml The html that's stored in the module
     */
    convertToNewStyle: function(oldHtml) {
        var _this = this;

        // Manually call the "createNewModule" action that is usually triggered by 
        // dropping a new module on the page
        $.post(_EDITOR.getAjaxURL(), { 'action': 'createNewModule', 'module': 'customhtml' }, function(data) {

            // This call handles the results of the manually-simulated "createNewModule" call
            var d = data;
            var newId = d._metadata.id;

            // We now have enough data to add a draghandle now, so do it
            var draghandleData = { 'name': d._metadata.friendly_name };
            _this.addDragHandle(draghandleData);

            // Make an ajax call that will trigger a "convert to new style" function inside the customhtml PHP class
            $.post('/adm/ajax.php?m=' + newId + '&a=convertToNewStyle', { 'html': oldHtml }, function(data) {
                _this.container.html(data.response.html);

                 // Dissaemble and reassemble the module div id to reflect the change to a "module" type 
                 // (not "nonnative") with an actual instance id (and not just "4")
                 var idParts = _this.element.attr('id').split('::');
                 var newDivId = idParts[0] + '::' + idParts[1] + '::' + 'module::' + newId + '::customhtml';
                 _this.element.attr('id', newDivId);

                 _EDITOR.forceAllSave();
            }, 'json');
        }, 'json');
    }
});
