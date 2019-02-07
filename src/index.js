import alan_input from "./components/input/index.js";
import chatRoom from "./components/socket_pc/index.js";
import alan_pagination from "./components/pagination/index.js";


const components = [
	alan_input,
	chatRoom,
  alan_pagination,
	// ...如果还有的话继续添加
];

const install = function(Vue, opts = {}) {
	components.map(component => {
		Vue.component(component.name, component);
	})
}

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue);
}

export default {
	install,
	alan_input,
	chatRoom,
  alan_pagination,

	// ...如果还有的话继续添加
}
