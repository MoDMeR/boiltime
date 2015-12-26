var pageInfo = {
    pageName: 'Главная страница',
    rightMenu: false,
    leftMenu: false,
};

var navBar = {
    
    nav_bar: '#nav_bar',
    nav_bar_tpl: '#nav_bar_tpl',
    
    render_navbar: function(){
        $(this.nav_bar).html('');
        $(this.nav_bar).append(navbar_tpl(pageInfo));
    }
};


var mainPage = {
    page: '#page',
    main_page_tpl: '#main_page_tpl',

    render_mainpage: function() {
        var template = _.template($(this.main_page_tpl).html());
        $(this.page).html('');
        $(this.page).append(template);
        App.setCallBack();
    }
};

var settingPage = {
    
    setting_page_tpl: '#setting_page_tpl',
    
    render_setting: function() {
        var setting_page_tpl = _.template($(this.setting_page_tpl).html());
        
        pageInfo.pageName = 'Краткая информация о приложении';
        pageInfo.rightMenu = true;
        
        $(document).prop('title', pageInfo.pageName);
        
        navBar.render_navbar();
        $(mainPage.page).html('');
        $(mainPage.page).append(setting_page_tpl);
    }
};

var loadList = {
    
    list_tpl: '#list_tpl',
    
    render_list: function(load) {
        var load = load;
        var filterName = '?filter[category_name]=';
        var list_page_tpl = _.template($(this.list_tpl).html());
        
        App.request(filterName,load, function(data){
            
            pageInfo.pageName = data[0].terms.category[0].name;
            pageInfo.rightMenu = true;

            $(document).prop('title', data[0].terms.category[0].name);
            navBar.render_navbar();
            $(mainPage.page).html('');
            $(mainPage.page).append(list_page_tpl({items: data}));
        });
    }
};

var loadDetail = {
    
    detail_tpl: '#detail_tpl',
    
    render_detail: function(id) {
        var load = '';
        var filterName = id;
        
        var detail_page_tpl = _.template($(this.detail_tpl).html());
    
        App.request(filterName, load, function(data){
            pageInfo.pageName = data.title;
            pageInfo.rightMenu = true;
            
            $(document).prop('title', data.title);
            navBar.render_navbar();
            $(mainPage.page).html('');
            $(mainPage.page).append(detail_page_tpl(data));
        });
    }
};

var App = {
    
    init: function(){
        navbar_tpl = _.template($(navBar.nav_bar_tpl).html());
        navBar.render_navbar();
        mainPage.render_mainpage();
	},
    
    setCallBack: function() {
        // Load list or setting page
        $('#main_page a').on('click', function(){
            var load = $(this).data('load');

            if (load != 'setting') {
                loadList.render_list(load);
            } else {
                settingPage.render_setting();
            }
            return false;
        });
        // /Load list or setting page
        
        // Load detail
        $('body').on('click', '.collection .collection-item', function(){
            var id = $(this).data('id');
            loadDetail.render_detail(id);
        });
        // /Load detail
        
        // Load home screen
        $('body').on('click', '.load_index', function(){
            location.reload();
            return false;
        });
        // /Load home screen
        
        // Set timer
        $('body').on('click', '#timer', function(){
            var self = this;
            if ($(self).attr('disabled')) {
                Materialize.toast('Таймер уже запущен!', 4000);
            } else {
                var timer = new Timer();
                var time = $(this).data('time') * 60;
                
                $(self).attr("disabled","disabled");
                chrome.runtime.sendMessage({time:time});
                timer.start({countdown: true, startValues: {seconds: time}});

                Materialize.toast(timer.getTimeValues().toString(), time * 1000, 'time-toast');

                timer.addEventListener('secondsUpdated', function (e) {
                    $('body .time-toast').html(timer.getTimeValues().toString());
                });
                timer.addEventListener('targetAchieved', function (e) {
                    $(self).removeAttr('disabled');
                });
            }
            return false;
        });
        // /Set timer
        
        // Modal
        $('.modal-trigger').leanModal();
        // /Modal
    },
    
    request: function (filterName, load, callback){
        $('.preloader').fadeIn(300).show();
        $.ajax({
            url: 'http://скольковарить.рф/api/wp-json/posts/'+ filterName + load,
            type: 'GET',
            crossDomain:true,
            success: function(data) {
                if(data.length > 0 || Object.keys(data).length > 0) {
                    callback(data);
                    $('.preloader').fadeOut(300).hide();
                } else {
                    $('.preloader').fadeOut(300).hide();
                    Materialize.toast('А тут пусто =(', 4000);
                }
            },
            error: function(data) {
                Materialize.toast(data.message, 4000);
            }
        });
    },
};


$(function(){
    var a = App;
    a.init();
});