import chatRoom from './socket_pc';

chatRoom.install = Vue => Vue.component(chatRoom.name, chatRoom);

export default chatRoom;