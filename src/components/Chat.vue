<template>
  <v-container class="fill-height" max-width="900">
    <v-card class="d-flex flex-column" height="100%" width="100%">
      <!-- Header del chat -->
      <v-card-title class="bg-primary text-white">
        <v-icon class="mr-2">mdi-chat</v-icon>
        Chat Simple
      </v-card-title>

      <!-- Área de mensajes -->
      <v-card-text class="flex-grow-1 overflow-y-auto pa-4">
        <div v-for="(mensaje, index) in mensajes" :key="index" class="mb-3">
          <div 
            :class="['d-flex', mensaje.usuario === 'yo' ? 'justify-end' : 'justify-start']"
          >
            <v-chip
              :color="mensaje.usuario === 'yo' ? 'primary' : 'grey-lighten-3'"
              :text-color="mensaje.usuario === 'yo' ? 'white' : 'black'"
              class="pa-3"
              style="height: auto; white-space: pre-wrap;"
            >
              {{ mensaje.texto }}
            </v-chip>
          </div>
          <div 
            :class="['text-caption text-grey mt-1', mensaje.usuario === 'yo' ? 'text-right' : 'text-left']"
          >
            {{ mensaje.hora }}
          </div>
        </div>
      </v-card-text>

      <!-- Input para escribir mensajes -->
      <v-card-actions class="pa-4">
        <v-text-field
          v-model="nuevoMensaje"
          label="Escribe un mensaje..."
          variant="outlined"
          density="compact"
          hide-details
          @keyup.enter="enviarMensaje"
          class="flex-grow-1"
        ></v-text-field>
        <v-btn 
          @click="enviarMensaje"
          :disabled="!nuevoMensaje.trim()"
          color="primary"
          class="ml-2"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'ChatSimple',
  data() {
    return {
      nuevoMensaje: '',
      mensajes: [
        {
          usuario: 'otro',
          texto: '¡Hola! ¿Cómo estás?',
          hora: '10:30'
        },
        {
          usuario: 'yo',
          texto: '¡Hola! Todo bien, ¿y tú?',
          hora: '10:31'
        },
        {
          usuario: 'otro',
          texto: 'Muy bien también, gracias por preguntar',
          hora: '10:32'
        }
      ]
    }
  },
  methods: {
    enviarMensaje() {
      if (this.nuevoMensaje.trim()) {
        const ahora = new Date();
        const hora = ahora.getHours().toString().padStart(2, '0') + ':' + 
                     ahora.getMinutes().toString().padStart(2, '0');
        
        this.mensajes.push({
          usuario: 'yo',
          texto: this.nuevoMensaje,
          hora: hora
        });
        
        this.nuevoMensaje = '';
        
        // Simular respuesta automática después de 1 segundo
        setTimeout(() => {
          this.respuestaAutomatica();
        }, 1000);
      }
    },
    respuestaAutomatica() {
      const respuestas = [
        'Interesante...',
        '¿En serio?',
        'Cuéntame más',
        'Entiendo',
        'Eso suena genial',
        '¿Y qué pasó después?',
        'Tienes razón',
        'No me digas...'
      ];
      
      const respuestaAleatoria = respuestas[Math.floor(Math.random() * respuestas.length)];
      const ahora = new Date();
      const hora = ahora.getHours().toString().padStart(2, '0') + ':' + 
                   ahora.getMinutes().toString().padStart(2, '0');
      
      this.mensajes.push({
        usuario: 'otro',
        texto: respuestaAleatoria,
        hora: hora
      });
    }
  }
}
</script>