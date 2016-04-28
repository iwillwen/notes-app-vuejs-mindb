<template>
  <div id="toolbar">
    <i @click="addNote" class="glyphicon glyphicon-plus"></i>
    <i @click="toggleFavorite"
      class="glyphicon glyphicon-star"
      :class="{starred: activeNote.favorite}"></i>
    <i @click="deleteNote" class="glyphicon glyphicon-remove"></i>
  </div>
</template>

<script>
import min from 'min'
import Note from '../note-model'

export default {

  data() {
    return {
      activeNote: {}
    }
  },

  ready() {
    min.on('editing', note => this.$data.activeNote = note)
  },

  methods: {
    changeActiveNode(id, note = null) {
      if (!note) {
        min.hgetall(`note:${id}`)
          .then(note => this.$data.activeNote = note)
        } else {
          this.$data.activeNote = note
        }
    },

    addNote() {
      const note = new Note()
      note.active()
      this.changeActiveNode(null, note)
    },

    deleteNote() {
      this.$data.activeNote.delete()
    },

    toggleFavorite() {
      this.$data.activeNote.toggleFavorite()
    }
  }
}
</script>
