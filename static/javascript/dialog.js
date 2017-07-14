/**
 * pop模态框      2.0.3
 */
(function (root, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function (require) {
            require('zepto.min');
            return factory(root);
        });
    } else {
        root.Pop = factory(root, {});
    }
})(this, function (root) {
    "use strict";

    // 类名常量
    var classPrefix = 'ui-pop-',
        idPrefix = 'uiPop';

    // 生成类名对象
    var CLASS = (function () {
        return {
            frame: classPrefix + 'frame',
            main: classPrefix + 'main',
            title: classPrefix + 'tit',
            content: classPrefix + 'cont',
            operation: classPrefix + 'operation',
            wait: classPrefix + 'wait'
        };
    }());

    // 生成ID名对象
    var ID = (function () {
        return {
            frame: idPrefix + 'Frame',
            confirmBtn: idPrefix + 'confirmBtn',
            cancelBtn: idPrefix + 'cancelBtn'
        }
    }());

    // 触摸事件类型
    var touchTap = $ && $.fn && $.fn.tap ? 'tap' : 'click';

    //策略对象
    var addDom = {
        alert: function () {
            var contStr = '';
            if (typeof arguments[0] === 'string') {
                contStr = arguments[0];
            } else {
                contStr = arguments[0].contStr;
            }

            var strHtml = '';
            strHtml += '<div class="' + CLASS.frame + '" id="' + ID.frame + '">';
            strHtml += '<div class="' + CLASS.main + '">';
            strHtml += '<div class="' + CLASS.content + '">' + contStr + '</div>';
            strHtml += '<div class="' + CLASS.operation + '">';
            strHtml += '<a href="javascript:;" id="' + ID.confirmBtn + '">确认</a>';
            strHtml += '</div>';
            strHtml += '</div>';
            strHtml += '</div>';

            return strHtml;
        },
        confirm: function () {
            var contStr = '',
                titStr = '';
            if (typeof arguments[0] === 'string') {
                contStr = arguments[0];
                titStr = arguments[1] || '确认提示';
            } else {
                contStr = arguments[0].contStr;
                titStr = arguments[0].titStr;
            }

            var strHtml = '';
            strHtml += '<div class="' + CLASS.frame + '" id="' + ID.frame + '">';
            strHtml += '<div class="' + CLASS.main + '">';
            strHtml += '<div class="' + CLASS.title + '">' + titStr + '</div>';
            strHtml += '<div class="' + CLASS.content + '">' + contStr + '</div>';
            strHtml += '<div class="' + CLASS.operation + '">';
            strHtml += '<a href="javascript:;" id="' + ID.cancelBtn + '">取消</a>';
            strHtml += '<a href="javascript:;" id="' + ID.confirmBtn + '">确认</a>';
            strHtml += '</div>';
            strHtml += '</div>';
            strHtml += '</div>';

            return strHtml;
        },
        wait: function () {
            var contStr = '';
            if (typeof arguments[0] === 'string') {
                contStr = arguments[0];
            } else {
                contStr = arguments[0].contStr;
            }
            var strHtml = '';
            strHtml += '<div class="' + CLASS.wait + '" id="' + ID.frame + '">';
            strHtml += '<div class="' + CLASS.main + '">'+ contStr + '</div>';
            strHtml += '</div>';
            return strHtml;
        }
    };

    var Pop = function (type) {
        this.type = type;
    };

    /*调用弹框*/
    Pop.prototype.run = function () {
        var self = this,
            confirmFunc = null,
            cancelFunc = null;

        self.close();

        if (typeof arguments[0] === 'object') {
            confirmFunc = arguments[0].confirmFunc;
            cancelFunc = arguments[0].cancelFunc;
        }

        // dom添加到页面中
        $('body').append(addDom[self.type].apply(self, arguments));

        // 确认按钮事件
        $('#' + ID.confirmBtn).on(touchTap, function () {
            self.close();
            confirmFunc && confirmFunc();
        });

        // 取消按钮事件
        $('#' + ID.cancelBtn).on(touchTap, function () {
            self.close();
            cancelFunc && cancelFunc();
        });

        // 自动关闭遮罩
        if(self.type==='wait'){
            if($('#uiPopFrame')[0]){
                setTimeout(function(){
                    $('#uiPopFrame').remove();
                },2000);
            }  
        }
    };

    Pop.prototype.close = Pop.prototype.destroy = function () {
        $('#' + ID.confirmBtn).off(touchTap);
        $('#' + ID.cancelBtn).off(touchTap);
        $('#' + ID.frame).remove();
    };
    return Pop;
});
