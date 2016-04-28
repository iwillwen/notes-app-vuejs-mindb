<template>
  <div id="note-editor">
    <textarea
      v-model="activeNoteText"
      @input="editNote"
      class="form-control">
    </textarea>
  </div>
</template>

<script>
import min from 'min'

export default {

  data() {
    return {
      note: null,
      activeNoteText: ''
    }
  },

  ready() {
    min.on('editing', note => {
      this.note = note,

      this.activeNoteText = note.content
    })
  },

  methods: {
    editNote() {
      this.note.edit(this.activeNoteText)
    }
  }

}
</script>
