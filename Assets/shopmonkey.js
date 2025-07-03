// $(document).ready(function () {  
//   if (template == 'pages/collection.rain') {
//     var prodList = [];
//     $.each($('.color-circles'), function(i, val) { 
//       prodList.push($(this).attr('data-title'));
//   	});
//     // console.log(prodList);
//     prodList.forEach(function(prodTitle){
//       // console.log(prodTitle)
//      // console.log(shopUrl + prodTitle + '?format-json');
//         $.get(shopUrl + prodTitle + '?format=json', function (data) {
//           var variantData = data.product.variants;
//           var colorList = []
//             for (var variantColor in variantData) {
//               colorList.push(variantData[variantColor].title);
//             }
//           console.log(colorList);
//         });
//     });
//   }
// });