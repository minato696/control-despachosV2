/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/ciudades/route";
exports.ids = ["app/api/ciudades/route"];
exports.modules = {

/***/ "(rsc)/./app/api/ciudades/route.ts":
/*!***********************************!*\
  !*** ./app/api/ciudades/route.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n// app/api/ciudades/route.ts\n\n\nasync function GET(request) {\n    try {\n        const { searchParams } = new URL(request.url);\n        const includeReporteros = searchParams.get('include') === 'reporteros';\n        const ciudades = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].ciudades.findMany({\n            orderBy: {\n                nombre: 'asc'\n            },\n            include: {\n                reporteros: includeReporteros,\n                _count: {\n                    select: {\n                        reporteros: true\n                    }\n                }\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(ciudades);\n    } catch (error) {\n        console.error('Error al obtener ciudades:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Error al obtener ciudades'\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    try {\n        const data = await request.json();\n        // Validar datos mínimos requeridos\n        if (!data.codigo || !data.nombre) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'El código y nombre de la ciudad son obligatorios'\n            }, {\n                status: 400\n            });\n        }\n        // Verificar si la ciudad ya existe\n        const existingCiudad = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].ciudades.findUnique({\n            where: {\n                codigo: data.codigo\n            }\n        });\n        if (existingCiudad) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: `La ciudad con código ${data.codigo} ya existe`\n            }, {\n                status: 400\n            });\n        }\n        const ciudad = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].ciudades.create({\n            data: {\n                codigo: data.codigo,\n                nombre: data.nombre,\n                activo: data.activo ?? true\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(ciudad);\n    } catch (error) {\n        console.error('Error al crear ciudad:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Error al crear ciudad'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2NpdWRhZGVzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSw0QkFBNEI7QUFDZTtBQUNUO0FBRTNCLGVBQWVFLElBQUlDLE9BQWdCO0lBQ3hDLElBQUk7UUFDRixNQUFNLEVBQUVDLFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUlGLFFBQVFHLEdBQUc7UUFDNUMsTUFBTUMsb0JBQW9CSCxhQUFhSSxHQUFHLENBQUMsZUFBZTtRQUUxRCxNQUFNQyxXQUFXLE1BQU1SLG1EQUFNQSxDQUFDUSxRQUFRLENBQUNDLFFBQVEsQ0FBQztZQUM5Q0MsU0FBUztnQkFBRUMsUUFBUTtZQUFNO1lBQ3pCQyxTQUFTO2dCQUNQQyxZQUFZUDtnQkFDWlEsUUFBUTtvQkFDTkMsUUFBUTt3QkFBRUYsWUFBWTtvQkFBSztnQkFDN0I7WUFDRjtRQUNGO1FBRUEsT0FBT2QscURBQVlBLENBQUNpQixJQUFJLENBQUNSO0lBQzNCLEVBQUUsT0FBT1MsT0FBTztRQUNkQyxRQUFRRCxLQUFLLENBQUMsOEJBQThCQTtRQUM1QyxPQUFPbEIscURBQVlBLENBQUNpQixJQUFJLENBQUM7WUFBRUMsT0FBTztRQUE0QixHQUFHO1lBQUVFLFFBQVE7UUFBSTtJQUNqRjtBQUNGO0FBRU8sZUFBZUMsS0FBS2xCLE9BQWdCO0lBQ3pDLElBQUk7UUFDRixNQUFNbUIsT0FBTyxNQUFNbkIsUUFBUWMsSUFBSTtRQUUvQixtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDSyxLQUFLQyxNQUFNLElBQUksQ0FBQ0QsS0FBS1YsTUFBTSxFQUFFO1lBQ2hDLE9BQU9aLHFEQUFZQSxDQUFDaUIsSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUFtRCxHQUM1RDtnQkFBRUUsUUFBUTtZQUFJO1FBRWxCO1FBRUEsbUNBQW1DO1FBQ25DLE1BQU1JLGlCQUFpQixNQUFNdkIsbURBQU1BLENBQUNRLFFBQVEsQ0FBQ2dCLFVBQVUsQ0FBQztZQUN0REMsT0FBTztnQkFBRUgsUUFBUUQsS0FBS0MsTUFBTTtZQUFDO1FBQy9CO1FBRUEsSUFBSUMsZ0JBQWdCO1lBQ2xCLE9BQU94QixxREFBWUEsQ0FBQ2lCLElBQUksQ0FDdEI7Z0JBQUVDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRUksS0FBS0MsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUFDLEdBQ3pEO2dCQUFFSCxRQUFRO1lBQUk7UUFFbEI7UUFFQSxNQUFNTyxTQUFTLE1BQU0xQixtREFBTUEsQ0FBQ1EsUUFBUSxDQUFDbUIsTUFBTSxDQUFDO1lBQzFDTixNQUFNO2dCQUNKQyxRQUFRRCxLQUFLQyxNQUFNO2dCQUNuQlgsUUFBUVUsS0FBS1YsTUFBTTtnQkFDbkJpQixRQUFRUCxLQUFLTyxNQUFNLElBQUk7WUFDekI7UUFDRjtRQUVBLE9BQU83QixxREFBWUEsQ0FBQ2lCLElBQUksQ0FBQ1U7SUFDM0IsRUFBRSxPQUFPVCxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQywwQkFBMEJBO1FBQ3hDLE9BQU9sQixxREFBWUEsQ0FBQ2lCLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQXdCLEdBQUc7WUFBRUUsUUFBUTtRQUFJO0lBQzdFO0FBQ0YiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcVVNVQVJJT1xcRGVza3RvcFxcREVWX0RBTlNcXGNvbnRyb2wtZGVzcGFjaG9zVjJcXGFwcFxcYXBpXFxjaXVkYWRlc1xccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gYXBwL2FwaS9jaXVkYWRlcy9yb3V0ZS50c1xyXG5pbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XHJcbmltcG9ydCBwcmlzbWEgZnJvbSAnQC9saWIvcHJpc21hJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogUmVxdWVzdCkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IHNlYXJjaFBhcmFtcyB9ID0gbmV3IFVSTChyZXF1ZXN0LnVybCk7XHJcbiAgICBjb25zdCBpbmNsdWRlUmVwb3J0ZXJvcyA9IHNlYXJjaFBhcmFtcy5nZXQoJ2luY2x1ZGUnKSA9PT0gJ3JlcG9ydGVyb3MnO1xyXG4gICAgXHJcbiAgICBjb25zdCBjaXVkYWRlcyA9IGF3YWl0IHByaXNtYS5jaXVkYWRlcy5maW5kTWFueSh7XHJcbiAgICAgIG9yZGVyQnk6IHsgbm9tYnJlOiAnYXNjJyB9LFxyXG4gICAgICBpbmNsdWRlOiB7XHJcbiAgICAgICAgcmVwb3J0ZXJvczogaW5jbHVkZVJlcG9ydGVyb3MsXHJcbiAgICAgICAgX2NvdW50OiB7XHJcbiAgICAgICAgICBzZWxlY3Q6IHsgcmVwb3J0ZXJvczogdHJ1ZSB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGNpdWRhZGVzKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgYWwgb2J0ZW5lciBjaXVkYWRlczonLCBlcnJvcik7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0Vycm9yIGFsIG9idGVuZXIgY2l1ZGFkZXMnIH0sIHsgc3RhdHVzOiA1MDAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcclxuICAgIFxyXG4gICAgLy8gVmFsaWRhciBkYXRvcyBtw61uaW1vcyByZXF1ZXJpZG9zXHJcbiAgICBpZiAoIWRhdGEuY29kaWdvIHx8ICFkYXRhLm5vbWJyZSkge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgICAgeyBlcnJvcjogJ0VsIGPDs2RpZ28geSBub21icmUgZGUgbGEgY2l1ZGFkIHNvbiBvYmxpZ2F0b3Jpb3MnIH0sXHJcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFZlcmlmaWNhciBzaSBsYSBjaXVkYWQgeWEgZXhpc3RlXHJcbiAgICBjb25zdCBleGlzdGluZ0NpdWRhZCA9IGF3YWl0IHByaXNtYS5jaXVkYWRlcy5maW5kVW5pcXVlKHtcclxuICAgICAgd2hlcmU6IHsgY29kaWdvOiBkYXRhLmNvZGlnbyB9XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgaWYgKGV4aXN0aW5nQ2l1ZGFkKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IGVycm9yOiBgTGEgY2l1ZGFkIGNvbiBjw7NkaWdvICR7ZGF0YS5jb2RpZ299IHlhIGV4aXN0ZWAgfSxcclxuICAgICAgICB7IHN0YXR1czogNDAwIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgY2l1ZGFkID0gYXdhaXQgcHJpc21hLmNpdWRhZGVzLmNyZWF0ZSh7XHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBjb2RpZ286IGRhdGEuY29kaWdvLFxyXG4gICAgICAgIG5vbWJyZTogZGF0YS5ub21icmUsXHJcbiAgICAgICAgYWN0aXZvOiBkYXRhLmFjdGl2byA/PyB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oY2l1ZGFkKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgYWwgY3JlYXIgY2l1ZGFkOicsIGVycm9yKTtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnRXJyb3IgYWwgY3JlYXIgY2l1ZGFkJyB9LCB7IHN0YXR1czogNTAwIH0pO1xyXG4gIH1cclxufSJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJHRVQiLCJyZXF1ZXN0Iiwic2VhcmNoUGFyYW1zIiwiVVJMIiwidXJsIiwiaW5jbHVkZVJlcG9ydGVyb3MiLCJnZXQiLCJjaXVkYWRlcyIsImZpbmRNYW55Iiwib3JkZXJCeSIsIm5vbWJyZSIsImluY2x1ZGUiLCJyZXBvcnRlcm9zIiwiX2NvdW50Iiwic2VsZWN0IiwianNvbiIsImVycm9yIiwiY29uc29sZSIsInN0YXR1cyIsIlBPU1QiLCJkYXRhIiwiY29kaWdvIiwiZXhpc3RpbmdDaXVkYWQiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJjaXVkYWQiLCJjcmVhdGUiLCJhY3Rpdm8iXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/ciudades/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n// lib/prisma.ts\n\nlet prisma;\nif (false) {} else {\n    // Prevenir múltiples instancias en desarrollo\n    if (!global.prisma) {\n        global.prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n            log: [\n                'query',\n                'error',\n                'warn'\n            ]\n        });\n    }\n    prisma = global.prisma;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGdCQUFnQjtBQUM4QjtBQUU5QyxJQUFJQztBQUVKLElBQUlDLEtBQXFDLEVBQUUsRUFFMUMsTUFBTTtJQUNMLDhDQUE4QztJQUM5QyxJQUFJLENBQUMsT0FBZ0JELE1BQU0sRUFBRTtRQUMxQkUsT0FBZUYsTUFBTSxHQUFHLElBQUlELHdEQUFZQSxDQUFDO1lBQ3hDSSxLQUFLO2dCQUFDO2dCQUFTO2dCQUFTO2FBQU87UUFDakM7SUFDRjtJQUNBSCxTQUFTLE9BQWdCQSxNQUFNO0FBQ2pDO0FBRUEsaUVBQWVBLE1BQU1BLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcVVNVQVJJT1xcRGVza3RvcFxcREVWX0RBTlNcXGNvbnRyb2wtZGVzcGFjaG9zVjJcXGxpYlxccHJpc21hLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGxpYi9wcmlzbWEudHNcclxuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnO1xyXG5cclxubGV0IHByaXNtYTogUHJpc21hQ2xpZW50O1xyXG5cclxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcclxuICBwcmlzbWEgPSBuZXcgUHJpc21hQ2xpZW50KCk7XHJcbn0gZWxzZSB7XHJcbiAgLy8gUHJldmVuaXIgbcO6bHRpcGxlcyBpbnN0YW5jaWFzIGVuIGRlc2Fycm9sbG9cclxuICBpZiAoIShnbG9iYWwgYXMgYW55KS5wcmlzbWEpIHtcclxuICAgIChnbG9iYWwgYXMgYW55KS5wcmlzbWEgPSBuZXcgUHJpc21hQ2xpZW50KHtcclxuICAgICAgbG9nOiBbJ3F1ZXJ5JywgJ2Vycm9yJywgJ3dhcm4nXSwgLy8gQcOxYWRlIGxvZ3MgcGFyYSBkZXB1cmFyXHJcbiAgICB9KTtcclxuICB9XHJcbiAgcHJpc21hID0gKGdsb2JhbCBhcyBhbnkpLnByaXNtYTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHJpc21hOyJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCJwcm9jZXNzIiwiZ2xvYmFsIiwibG9nIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fciudades%2Froute&page=%2Fapi%2Fciudades%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fciudades%2Froute.ts&appDir=C%3A%5CUsers%5CUSUARIO%5CDesktop%5CDEV_DANS%5Ccontrol-despachosV2%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CUSUARIO%5CDesktop%5CDEV_DANS%5Ccontrol-despachosV2&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fciudades%2Froute&page=%2Fapi%2Fciudades%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fciudades%2Froute.ts&appDir=C%3A%5CUsers%5CUSUARIO%5CDesktop%5CDEV_DANS%5Ccontrol-despachosV2%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CUSUARIO%5CDesktop%5CDEV_DANS%5Ccontrol-despachosV2&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_USUARIO_Desktop_DEV_DANS_control_despachosV2_app_api_ciudades_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/ciudades/route.ts */ \"(rsc)/./app/api/ciudades/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/ciudades/route\",\n        pathname: \"/api/ciudades\",\n        filename: \"route\",\n        bundlePath: \"app/api/ciudades/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\USUARIO\\\\Desktop\\\\DEV_DANS\\\\control-despachosV2\\\\app\\\\api\\\\ciudades\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_USUARIO_Desktop_DEV_DANS_control_despachosV2_app_api_ciudades_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZjaXVkYWRlcyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGY2l1ZGFkZXMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZjaXVkYWRlcyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNVU1VBUklPJTVDRGVza3RvcCU1Q0RFVl9EQU5TJTVDY29udHJvbC1kZXNwYWNob3NWMiU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDVVNVQVJJTyU1Q0Rlc2t0b3AlNUNERVZfREFOUyU1Q2NvbnRyb2wtZGVzcGFjaG9zVjImaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ3dDO0FBQ3JIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxVU1VBUklPXFxcXERlc2t0b3BcXFxcREVWX0RBTlNcXFxcY29udHJvbC1kZXNwYWNob3NWMlxcXFxhcHBcXFxcYXBpXFxcXGNpdWRhZGVzXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9jaXVkYWRlcy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2NpdWRhZGVzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9jaXVkYWRlcy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXFVTVUFSSU9cXFxcRGVza3RvcFxcXFxERVZfREFOU1xcXFxjb250cm9sLWRlc3BhY2hvc1YyXFxcXGFwcFxcXFxhcGlcXFxcY2l1ZGFkZXNcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fciudades%2Froute&page=%2Fapi%2Fciudades%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fciudades%2Froute.ts&appDir=C%3A%5CUsers%5CUSUARIO%5CDesktop%5CDEV_DANS%5Ccontrol-despachosV2%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CUSUARIO%5CDesktop%5CDEV_DANS%5Ccontrol-despachosV2&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fciudades%2Froute&page=%2Fapi%2Fciudades%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fciudades%2Froute.ts&appDir=C%3A%5CUsers%5CUSUARIO%5CDesktop%5CDEV_DANS%5Ccontrol-despachosV2%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CUSUARIO%5CDesktop%5CDEV_DANS%5Ccontrol-despachosV2&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();