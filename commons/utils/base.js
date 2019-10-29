const _ = require("lodash");
const moment = require("moment");

module.exports = function (){
    this.removeChildren = (node) => {
        node.parentElement.removeChild(node);
    };

    this.getElById = (id) => {
        return document.getElementById(id);
    };

    this.getElsByClass = (cl) => {
        return document.getElementsByClassName(cl);
    };

    this.getElsByTagName = (tagName) => {
        return document.getElementsByClassName(tagName);
    };

    this.getStyle = (el, styleProp) => {
        var value, defaultView = (el.ownerDocument || document).defaultView;
        // W3C standard way:
        if (defaultView && defaultView.getComputedStyle) {
            // sanitize property name to js notation
            // (hypen separated words eg. font-Size)
            styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
            return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
        } else if (el.currentStyle) { // IE
            // sanitize property name to camelCase
            styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
                return letter.toUpperCase();
            });
            value = el.currentStyle[styleProp];
            // convert other units to pixels on IE
            if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
                return (function(value) {
                    var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
                    el.runtimeStyle.left = el.currentStyle.left;
                    el.style.left = value || 0;
                    value = el.style.pixelLeft + "px";
                    el.style.left = oldLeft;
                    el.runtimeStyle.left = oldRsLeft;
                    return value;
                })(value);
            }
            return value;
        }
    };

    this.collectionHas = (a, b) => {
        //helper function (see below)
        for (var i = 0, len = a.length; i < len; i++) {
            if (a[i] === b) return true;
        }
        return false;
    };

    this.getParent = (element, selector) => {
        try {
            var all = document.querySelectorAll(selector);
            var cur = element.parentNode;
            while (cur && !this.collectionHas(all, cur)) {
                //keep going up until you find a match
                cur = cur.parentNode; //go up
            }
            return cur; //will return null if not found
        } catch (ex) {
            console.log("Can't get parent", ex);
            return null;
        }
    };

    this.extend = (destination, source)  => {

        return destination;
    };

    this.simulate = (element, eventName) =>  {
        var eventMatchers = {
            'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
            'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
        };
        var defaultOptions = {
            pointerX: 0,
            pointerY: 0,
            button: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            bubbles: true,
            cancelable: true
        };
        const source = arguments[2];
        for (var property in source) {
            defaultOptions[property] = source[property];
        }
        var options = defaultOptions;
        var oEvent,
            eventType = null;
        for (var name in eventMatchers) {
            if (eventMatchers[name].test(eventName)) {
                eventType = name;break;
            }
        }

        if (!eventType) throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

        if (document.createEvent) {
            oEvent = document.createEvent(eventType);
            if (eventType == 'HTMLEvents') {
                oEvent.initEvent(eventName, options.bubbles, options.cancelable);
            } else {
                oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView, options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
            }
            //if (oEvent.originalEvent.originalTarget.id == 'opts.fallback_id')
            //    return;


            element.dispatchEvent(oEvent);
            oEvent.stopPropagation(); // chan truong hop loi maximum call stack size exceeded
        } else {
            options.clientX = options.pointerX;
            options.clientY = options.pointerY;
            var evt = document.createEventObject();
            oEvent = this.extend(evt, options);
            element.fireEvent('on' + eventName, oEvent);
        }
        return element;
    };

    this.difference = (object, base, keys) => {
        function changes(object, base) {
            return _.transform(object, function(result, value, key) {
                if (keys.indexOf(key) > -1 && !_.isEqual(value, base[key])) {
                    result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
                }
            });
        }
        return changes(object, base);
    };

    this.validStringNotSpecical = (str) => {
        str.replace(/-{2,}/gm, '-');
        const regex = new RegExp(/^[\w- ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/);
        return regex.test(str);
    };

    this.validPassword = (str) => {
        const regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}/);
        return regex.test(str);
    };

    this.validPassword2 = (str) => {
        const regex = new RegExp(/^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,32}/);
        return regex.test(str);
    };

    this.validName = (str) => {
        const regex = new RegExp(/^[a-zA-Z ÀÁÂÃĂẠẢẤẦẨẪẬẮẰẲẴẶàáâãăạảấầẩẫậắằẳẵặĐđÈÉÊẸẺẼỀẾỀỂỄỆèéêếẹẻẽềềểễệÌÍĨỈỊìíĩỉịÒÓÔÕỌỎỐỒỔỖỘỚỜƠỞỠỢòóôõọỏốồổỗộơớờởỡợÙÚŨƯỤỦỨỪỬỮỰùúũưụủứừửữựỲỴÝỶỸỳỵỷỹ]+$/);
        return regex.test(str);
    };

    this.validUsername = (str) => {
        const regex = new RegExp(/^[a-zA-Z_0-9]+$/);
        return regex.test(str);
    };

    this.subString = (str) => {
        str = str.trim().replace(/\s{2,}/g, ' ');
        const arr = str.split(' ');
        let result = [];
        _.forEach(arr, value => {
            result.push(value.replace(/^[a-zÀÁÂÃĂẠẢẤẦẨẪẬẮẰẲẴẶàáâãăạảấầẩẫậắằẳẵặĐđÈÉÊẸẺẼỀẾỀỂỄỆèéêếẹẻẽềềểễệÌÍĨỈỊìíĩỉịÒÓÔÕỌỎỐỒỔỖỘỚỜƠỞỠỢòóôõọỏốồổỗộơớờởỡợÙÚŨƯỤỦỨỪỬỮỰùúũưụủứừửữựỲỴÝỶỸỳỵỷỹ]/, value.charAt(0).toLocaleUpperCase()));
        });
        return result.join(' ');
    };

    this.validEmail = (str) => {
        const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regex.test(str);
    };

    this.validNumber = (str) => {
        const regex = new RegExp(/^\d+$/);
        return regex.test(str);
    };

    this.validDate = (str) => {
        return moment(str, "DD/MM/YYYY").isValid();
    };

    this.validString = (str) => {
        if(typeof str === "string"){
            return str.trim() !== "";
        }
        return false;
    };
};