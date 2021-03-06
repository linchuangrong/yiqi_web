/**
 * 作者：林创荣
 * 功能：我的活动
 * 时间：2016年9月18日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件

	app.addController("myActivityController", myActivityController);
	myActivityController.$inject = ['$rootScope', 'personalService', '$filter', '$window'];

	function myActivityController($rootScope, personalService, $filter, $window) {
		$rootScope.title = "我的活动";
		var vm = this;

		/*****************变量 begin****************/

		//活动列表分页参数
		vm.pageParams = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 10, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 1, //总共多少页
			pageChange: pageChangeFn //切换页面函数
		}
		vm.activityArray = []; //活动列表数组

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getActiivtyList = getActiivtyListFn; //获取活动列表
		vm.setActivityStop = setActivityStopFn; //设置活动是否已经结束（进行中，已结束）

		/*****************函数 end****************/

		(function init() {
			vm.getActiivtyList();
		})();

		//
		//
		//
		//
		//
		//-----------------------------获取活动列表-----------------------------------------
		//
		//
		//
		//
		//
		function getActiivtyListFn() {
			var params = {
				"type": 1, //活动是1，众筹是3
				"username": $rootScope.userInfo.user_name,
				"pageSize": vm.pageParams.pageSize,
				"current": vm.pageParams.current
			}
			personalService.getUserAddActivity(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						vm.activityArray = data.data.list;
						vm.pageParams.page_count = data.data.page_count; //总页码
						//循环添加一个属性，记录年月
						angular.forEach(vm.activityArray, function(data) {
							data["year_month"] = $filter('toYearMonth')(data["begin_time"]);
						});
						//请求结束
						vm.loaded = true;
					} else {
						window.showAutoDialog(data.data.msg);
					}
				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------分页事件------------------------------------------
		//
		//
		//
		//
		//
		function pageChangeFn() {
			return function(param) {
				if (parseInt(param) > 0 && parseInt(param) <= vm.pageParams.page_count) {
					//修改页码
					vm.pageParams.current = parseInt(param);
					//获取数据
					vm.getActiivtyList();
					//滚动到顶部
					angular.element($window).scrollTop(0);
				} else {
					console.log("输入非法");
				}
			}
		}

		//
		//
		//
		//
		//
		//-----------------------------检查活动是否已经结束（param=结束时间）-----------------------------------------
		//
		//
		//
		//
		//
		function setActivityStopFn(param) {
			var now = Date.parse(new Date()) / 1000;
			if (now >= param) {
				return true; //已经停止
			} else {
				return false; //进行中
			}
		}
	}
})();