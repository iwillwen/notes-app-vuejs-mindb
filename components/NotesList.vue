<template>
  <div id="notes-list">

    <div id="list-header">
      <h2>Notes | coligo</h2>
      <div class="btn-group btn-group-justified" role="group">
        <!-- All Notes button -->
        <div class="btn-group" role="group">
          <button type="button" class="btn btn-default"
            @click="show = 'all'"
            :class="{active: show === 'all'}">
            All Notes
          </button>
        </div>
        <!-- Favorites Button -->
        <div class="btn-group" role="group">
          <button type="button" class="btn btn-default"
            @click="show = 'favorites'"
            :class="{active: show === 'favorites'}">
            Favorites
          </button>
        </div>
      </div>
    </div>
    <!-- render notes in a list -->
    <div class="container">
      <div class="list-group">
        <a v-for="note in filteredNotes"
          class="list-group-item" href="#"
          :class="{active: activeNote === note}"
          @click="updateActiveNote(note)">
          <h4 class="list-group-item-heading">
            {{note.content.trim().substring(0, 30)}}
          </h4>
        </a>
      </div>
    </div>

  </div>
</template>

<script>
import min from 'min'
import Note from '../note-model'

export default {
  data() {
    return {
      show: 'all',
      notes: [],
      activeNote: {}
    }
  },

  ready() {
    Note.allNotes()
      .then(notes => {
        !notes.length || notes[0].active()
        this.notes = notes
        this.activeNote = notes[0]
      })

    min
      .on('new-note', note => {
        this.notes.unshift(note)
        this.activeNote = note
      })
      .on('mark-favorite', (id, favorite) => {
        (this.notes.filter(note => note.id === id)[0] || {}).favorite = favorite
      })
      .on('remove-note', note => {
        this.notes.splice(this.notes.map((n, i) => n.id == note.id ? i : 0)
          .reduce((a, b) => a + b), 1)

        if (this.activeNote.id == note.id) {
          this.notes[0].active()
          this.activeNote = notes[0]
        }
      })

  },

  methods: {
    updateActiveNote(note) {
      this.activeNote = note
      note.active()
    }
  },

  computed: {
    filteredNotes() {
      if (this.show === 'all') {
        return this.notes
      } else if (this.show === 'favorites') {
        return this.notes.filter(note => note.favorite)
      }
    }
  }
}
</script>
