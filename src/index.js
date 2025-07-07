import Chat from './components/Chat.vue'

// Función de instalación para usar como plugin
const install = (app) => {
  app.component('Chat', Chat)
}

// Exportar componente individual y función de instalación
export { Chat }
export default { install }