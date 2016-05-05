define([
    'jQuery',
    'Underscore',
    'Backbone',
], function($, _, Backbone){
    var PaginatorComponent = Backbone.View.extend({
        data:[],
        page:0,
        numPages:0,
        numObjectPerPage:12,
    	events:{
    		"click .btnPage":"onPage",
            "click #btnPaginatorPrev":"onPrevPage",
            "click #btnPaginatorNext":"onNextPage"
    	},
    	onChange: function(suscriber, callback){
             this.on('onChange', callback, suscriber);
        },
        setData:function(data){
            this.data = data;
        },
        getDataPage:function(){
            var resultData = [];

            for (var i = (this.page*this.numObjectPerPage); i < ((this.page*this.numObjectPerPage)+this.numObjectPerPage); i++) {
                if(i <= (this.data.length-1)){
                    resultData.push(this.data.at(i));
                }
            }

            return resultData;
        },
        render:function(){
            this.numPages = Math.ceil(this.data.length/this.numObjectPerPage);

            var htmlPaginator = "";

            htmlPaginator += "<li id='lyerPaginatorPrev'><a href='#' id='btnPaginatorPrev' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></a></li>";

            for (var i = 0; i < this.numPages; i++) {
                htmlPaginator += "<li><a href='#' class='btnPage' data-page='"+i+"'>"+ (i+1) +"</a></li>";
            };

            htmlPaginator += "<li><a href='#' id='btnPaginatorNext' aria-label='Next'><span aria-hidden='true'>&raquo;</span></a></li>";

           this.$el.html(htmlPaginator);

           this.validatePaginatorStates();
        },
        onPage:function(ev){
            ev.preventDefault();
            var newPage = $(ev.target).attr('data-page');
            this.page = newPage;
            this.trigger('onChange', this.getDataPage());
            this.validatePaginatorStates();
        },
        onPrevPage:function(ev){
            ev.preventDefault();

            if(this.page <= 0)
                this.page = 0;
            else
                this.page = this.page - 1;

            this.trigger('onChange', this.getDataPage());

            this.validatePaginatorStates();
        },
        onNextPage:function(ev){
            ev.preventDefault();  

            if(this.page >= (this.numPages-1))
                this.page = this.numPages-1;
            else
                this.page = this.page + 1;
            
            this.trigger('onChange', this.getDataPage());

            this.validatePaginatorStates();
        },
        validatePaginatorStates:function(){
            var selfView = this;

            if(this.page <= 0)
                $("#btnPaginatorPrev", this.$el).parent().addClass('disabled');
            else
                $("#btnPaginatorPrev", this.$el).parent().removeClass('disabled');

            if(this.page >= (this.numPages-1))
                $("#btnPaginatorNext", this.$el).parent().addClass('disabled');
            else
                $("#btnPaginatorNext", this.$el).parent().removeClass('disabled');

            $(".btnPage", this.$el).each(function(){
                if($(this).attr('data-page') == selfView.page){
                    $(this).parent().addClass('active');
                    var pageValue = Number(selfView.page) + 1;
                    $(this).html(pageValue + " <span class='sr-only'>(current)</span>");
                } else {
                    $(this).parent().removeClass('active');
                    var pageValue = Number($(this).attr('data-page')) + 1;
                    $(this).html(pageValue);
                }
            });
        }
    });

    return PaginatorComponent;
});