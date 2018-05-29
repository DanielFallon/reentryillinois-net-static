/* Class for images */
var media_image = $.inherit(Module, {
    __constructor: function(div) { 
        this.__base(div);
        this.isResizing = true;
        this.type = "media_image";

        if(window.addEventListener) {
            window.addEventListener ("message", this.receiveMessage, false);
        }
    },

    receiveMessage: function( event ) {
        if( "http://"+window.location.host === event.origin && event.data == "reload parent tab" ) {
            event.target.TabLoader.tabList[1].reload();
            ModuleLoader.reloadModules("media_image");
        }
    },


    getEditJSON: function() {
        return {
            action: "editPrompt",
            uid: this.uid,
            alt: this.$imgDiv.attr("alt"),
            id: this.getID(),
            type: this.getType(),
            divtype: this.getDivType(),
            showInMobile: !this.element.hasClass("mobile_hide"),
            mobileLayout: _EDITOR.isMobileOn()
        };
    },

    loadModuleCallback: function(data) {
        this.$imgDiv = this.container.find("img").first();
        if (this.$imgDiv.size() == 0) {
            this.container.html(data.html);
            this.$imgDiv = this.container.find("img").first();
        }
        this.$imgDiv.attr("src", data.filename+"?"+$.now());
        // If we are a new drop and the image is smaller than the region,
        // make it its original size.
        if (this.element.attr('style') == undefined) {
            var parentWidth = this.element.parent().width();

            if (data.width <= parentWidth) {
                this.element.css({ 'width': data.width, 'height': data.height });
            }
            else {
                var newHeight = ((parentWidth / data.width) * data.height);
                this.element.css({ 'width': parentWidth, 'height': newHeight });
            }
        }
        else {
            var modW = this.element.width();
            this.element.css({'width':modW, 'height':modW*data.height/data.width});
        }

        this.$imgDiv.css({"width": "100%", "height": "auto"});
        this.$imgDiv.attr("height", "auto").attr("width", "100%");


        this.draghandle.addOptionLink("Link", createRef(this, this.createLink));
        this.draghandle.addOptionLink("Edit Image", createRef(this, this.editImage));

        this.addDragHandle(data);
        this.manageModuleMargins();

        this.addResizing();
    },


    /*
     * This appropriatelyResize differs from the one inside of module.js in that it looks
     * at the height and width of the image inside ths module container as opposed to the
     * entire element itself when deciding how to resize the module.
     /
    appropriatelyResize: function() {
        var $par = this.container.parents(REGIONCLASS).first();
        var w = this.element.find('img').width();
        var h = this.element.find('img').height();
        var neww = w;
        var newh = h;
        var issetH = issetW = false;
        var aspectRatio = h / w;

        if (w > $par.width()) {
            issetW = true;
            neww = $par.width();

            if (this.keepAspectRatio) {
                issetH = true;
                newh = Math.round(neww * aspectRatio);
            }
        }
        else if (h > $par.height()) {
            issetH = true;
            newh = $par.height();
            if (this.keepAspectRatio) {
                issetW = true;
                neww = Math.round(newh * aspectRatio);
            }
        }

        if (issetW) {
            this.element.width(neww);
            this.container.width(neww);
        }

        if (issetH) {
            this.element.height(newh);
            this.container.height(newh);
        }

        // if any onresize is defined, we should call it (since we technically resized)
        this.onResize();
    },
    */

    saveOptions: function(options) {
        // Set image alt and title attributes
        this.$imgDiv.attr('alt', options.imgAlt);
        this.setMobileVisibility(options['cog-mobileHide']);

        // If this image is supposed to link somewhere, wrap an A tag around it, first
        // figuring out if we're replacing an existing A tag or if we need to create a new one
        if (options.href != '') {
            if (this.$imgDiv.parent()[0].tagName == 'A') {
                this.$imgDiv.parent().attr('href', options.href);

                if (options.newWindow == 'true') {
                    this.$imgDiv.parent().attr('target', '_blank');
                }
            }
            else {
                var $newATag = $('<a />').attr('href', options.href);

                if (options.newWindow == 'true') {
                    $newATag.attr('target', '_blank');
                }

                this.$imgDiv.wrap($newATag);
            }
        }
        else {
            // If this image had a link and now doesn't, clear the link
            if (this.$imgDiv.parent()[0].tagName == 'A') {
                this.$imgDiv.parent().replaceWith(this.$imgDiv);
            }
        }

        // Save the region containing this module
        _EDITOR.forceAllSave();
    },

    saveModule: function() {
        var $d = this.container.clone(false);
        $d.find(".ui-resizable-handle").remove();
        return $d.html();
    },


    editImage: function() {
        var win = window.open('/mediamanager/mme/mme.html?mid=' + this.id);
    },

    /* Open up the link creation lightbox */
    createLink: function(currentLinkHref, currentLinkNewWindowSetting, cbFunc) {
        var $a = $("<a></a>").addClass("WEBON_NO_HREF_SET");
        this.$imgDiv.wrap($a);
        _EDITOR.createLinkWindow($(".WEBON_NO_HREF_SET"));
    }
});
