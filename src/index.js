/**
 * index.js
 * 
 * Punto de entrada principal para el paquete npm del bot
 * Configura y exporta todos los componentes y funcionalidades
 */

// Importar Vue para verificar compatibilidad
import { version } from 'vue'

// Importar componente principal
import Chat from './components/Chat.vue'

// Importar plugins
import { registerPlugins } from './plugins/index.js'

// Importar estilos
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

// Configuración por defecto del bot
const DEFAULT_CONFIG = {
  theme: 'light',
  language: 'es',
  autoStart: true,
  position: 'bottom-right',
  colors: {
    primary: '#1976d2',
    secondary: '#424242',
    accent: '#82b1ff',
    error: '#ff5252',
    info: '#2196f3',
    success: '#4caf50',
    warning: '#ffc107'
  },
  messages: {
    welcome: 'Hola! ¿En qué puedo ayudarte?',
    placeholder: 'Escribe tu mensaje...',
    send: 'Enviar',
    minimize: 'Minimizar',
    close: 'Cerrar'
  }
}

// Lista de componentes para registro automático
const COMPONENTS = {
  Chat,
  BotChat: Chat, // Alias para mayor claridad
}

// Plugin principal del bot
const BotPlugin = {
  install(app, options = {}) {
    // Verificar compatibilidad de Vue
    const vueVersion = version.split('.')[0]
    if (parseInt(vueVersion) < 3) {
      console.error('[Bot] Este paquete requiere Vue 3.x')
      return
    }

    // Fusionar configuración
    const config = { ...DEFAULT_CONFIG, ...options }

    // Registrar plugins (Vuetify, etc.)
    registerPlugins(app)

    // Registrar componentes globalmente
    Object.entries(COMPONENTS).forEach(([name, component]) => {
      app.component(name, component)
    })

    // Proporcionar configuración global
    app.provide('botConfig', config)

    // Propiedades globales
    app.config.globalProperties.$bot = {
      config,
      version: '1.0.0',
      
      // Métodos globales del bot
      init: () => {
        console.log('[Bot] Inicializado con configuración:', config)
      },
      
      updateConfig: (newConfig) => {
        Object.assign(config, newConfig)
        console.log('[Bot] Configuración actualizada:', config)
      },
      
      getConfig: () => config,
      
      show: () => {
        document.dispatchEvent(new CustomEvent('bot:show'))
      },
      
      hide: () => {
        document.dispatchEvent(new CustomEvent('bot:hide'))
      },
      
      sendMessage: (message) => {
        document.dispatchEvent(new CustomEvent('bot:message', { detail: message }))
      },
      
      // Métodos específicos del chat
      openChat: () => {
        document.dispatchEvent(new CustomEvent('bot:open'))
      },
      
      closeChat: () => {
        document.dispatchEvent(new CustomEvent('bot:close'))
      },
      
      toggleChat: () => {
        document.dispatchEvent(new CustomEvent('bot:toggle'))
      }
    }

    // Auto-inicializar si está configurado
    if (config.autoStart) {
      app.config.globalProperties.$bot.init()
    }
  }
}

// Función para crear instancia del bot
export const createBot = (config = {}) => {
  const botConfig = { ...DEFAULT_CONFIG, ...config }
  
  return {
    config: botConfig,
    
    start: () => {
      console.log('[Bot] Iniciado con configuración:', botConfig)
      document.dispatchEvent(new CustomEvent('bot:start', { detail: botConfig }))
    },
    
    stop: () => {
      console.log('[Bot] Detenido')
      document.dispatchEvent(new CustomEvent('bot:stop'))
    },
    
    updateConfig: (newConfig) => {
      Object.assign(botConfig, newConfig)
      console.log('[Bot] Configuración actualizada:', botConfig)
    },
    
    sendMessage: (message) => {
      document.dispatchEvent(new CustomEvent('bot:message', { detail: message }))
    },
    
    openChat: () => {
      document.dispatchEvent(new CustomEvent('bot:open'))
    },
    
    closeChat: () => {
      document.dispatchEvent(new CustomEvent('bot:close'))
    },
    
    toggleChat: () => {
      document.dispatchEvent(new CustomEvent('bot:toggle'))
    },
    
    on: (event, callback) => {
      document.addEventListener(`bot:${event}`, callback)
    },
    
    off: (event, callback) => {
      document.removeEventListener(`bot:${event}`, callback)
    }
  }
}

// Función utilitaria para instalar solo componentes específicos
export const installComponents = (app, components = []) => {
  components.forEach(name => {
    if (COMPONENTS[name]) {
      app.component(name, COMPONENTS[name])
    } else {
      console.warn(`[Bot] Componente "${name}" no encontrado`)
    }
  })
}

// Función para crear widget flotante del chat
export const createChatWidget = (config = {}) => {
  const widgetConfig = { 
    ...DEFAULT_CONFIG, 
    ...config,
    widget: true,
    position: config.position || 'bottom-right'
  }
  
  return {
    config: widgetConfig,
    mount: (selector) => {
      const element = document.querySelector(selector)
      if (element) {
        element.innerHTML = '<chat v-bind="config"></chat>'
        console.log('[Bot] Widget montado en:', selector)
      }
    },
    unmount: (selector) => {
      const element = document.querySelector(selector)
      if (element) {
        element.innerHTML = ''
        console.log('[Bot] Widget desmontado de:', selector)
      }
    }
  }
}

// Exportación por defecto (para Vue.use())
export default BotPlugin

// Exportaciones nombradas (para import individual)
export {
  // Componente principal
  Chat,
  Chat as BotChat, // Alias
  
  // Plugins
  registerPlugins,
  
  // Configuración
  DEFAULT_CONFIG,
  
  // Constantes
  COMPONENTS
}

// Constantes públicas
export const BOT_VERSION = '1.0.0'
export const BOT_NAME = 'Vue Chat Bot'

// Auto-instalación en navegador (CDN)
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(BotPlugin)
}