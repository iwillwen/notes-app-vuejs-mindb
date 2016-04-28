import min from 'min'
import { v4 as genID } from 'node-uuid'

export default class Note {
  constructor(id = null, content = 'New Note', favorite = false) {
    this.id = id || genID()
    this.content = content
    this.favorite = favorite

    if (!id) {
      min.hmset(`note:${this.id}`, {
        id: this.id,
        content: content,
        favorite: favorite
      })
        .then(() => min.lpush('notes', this.id))
        .then(() => min.emit('new-note', this))
    }
  }

  edit(content) {
    this.content = content

    min.hset(`note:${this.id}`, 'content', content)
  }

  toggleFavorite() {
    this.favorite = !this.favorite

    min.hset(`note:${this.id}`, 'favorite', this.favorite)

    if (this.favorite) {
      min.lpush('favorite-notes', this.id)
    } else {
      min.lrem('favorite-notes', 0, this.id)
    }

    min.emit('mark-favorite', this.id, this.favorite)
  }

  delete() {
    min.lrem('notes', 0, this.id)
      .then(() => min.del(`note:${this.id}`))
      .then(() => min.emit('remove-note', this))
  }

  active() {
    min.emit('editing', this)
  }

  static allNotes() {
    return min.exists('notes')
      .then(exists => exists ? min.llen('notes') : Promise.resolve(0))
      .then(len => min.lrange('notes', 0, len))
      .then(ids => min.mget(ids.map(id => `note:${id}`)))
      .then(notes => Promise.resolve(notes.map(note => new Note(note.id, note.content, note.favorite))))
  }

  static favoriteNotes() {
    return min.exists('favorite-notes')
      .then(exists => exists ? min.llen('favorite-notes') : Promise.resolve(0))
      .then(len => min.lrange('notes', 0, len))
      .then(ids => min.mget(ids.map(id => `note:${id}`)))
      .then(notes => Promise.resolve(notes.map(note => new Note(note.id, note.content, note.favorite))))
  }
}