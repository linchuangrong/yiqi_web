/**
 * Created by Chunangrong on 2016/9/28.
 */
(function() {
	'use strict';

	angular.module("repeatDone.directive", [])
		.directive('repeatDone', function() {
			return {
				link: function(scope, element, attrs) {
					if(scope.$last) { // 这个判断意味着最后一个 OK
						scope.$eval(attrs.repeatDone) // 执行绑定的表达式
					}
				}
			}
		})
})();