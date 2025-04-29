import './App.css'
import { Routes} from 'react-router-dom'
import { Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import NotesForm from "./Components/NotesFormapp"
import "bootstrap/dist/css/bootstrap.min.css"
import { useMemo } from 'react'
import {v4 as uuiV4} from 'uuid';
import NoteList from './Components/NoteList'
// import NoteLayout from './Components/NoteLayout'
import { EditNote } from './Components/EditNote'
import { Note } from './Components/Note'
import { NoteLayout } from './Components/NoteLayout'
import { useLocalStorage } from './Components/useLocalStorage'


export type Note = {
  id : string
} & NoteData

export type RawNote = {
  id : string
} & RawNoteData

export type RawNoteData = {
  title : string,
  markdown : string,
  tagids : string[]
}
export type NoteData = {
  title : string,
  markdown : string,
  tags : Tag[]
}

export type Tag = {
  id : string,
  label : string
}
function App() {
  const [tags,setTags] = useLocalStorage<Tag[]>("TAGS",[]);
  const [notes,setNote] = useLocalStorage<RawNote[]>("NOTES",[]);

  const onCreateNote = ({tags, ...data}: NoteData)=>{
    setNote(prevNotes =>{
      return[
        ...prevNotes,
        {...data,id: uuiV4(), tagids : tags.map(tag => tag.id)}
      ]
    })
  }
  const onDeleteNote = (id : string)=>{
        setNote(prevNotes =>{
          return prevNotes.filter(note => note.id != id)
        })
  }

  function onUpdateNote(id : string, {tags, ...data}: NoteData){
    setNote(
      prevNotes =>{
        return prevNotes.map(note =>{
          if(note.id === id){
            return {...note,...data,tagIds : tags.map(tag => tag.id)}
          }
          else{
            return note
          }
        })
      }
    )
  }


  const addTag = (tag : Tag) =>{
    setTags(prev => [...prev, tag])
  }

const updateTag = (id: string, label: string) => {
      setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        } else {
          return tag
        }
      })
    })

};

  const deleteTag = (id : string)=>{
        setTags(prevTags =>{
          return prevTags.filter(tag => tag.id != id)
        })
  }         

const notesWithTags = useMemo(() => {
  return notes.map(note => {
    return {
      ...note,
      tags: tags.filter(tag => (note.tagids ?? []).includes(tag.id))
    }
  });
}, [notes, tags]);

  return (
    <>
      <Routes>
        <Route path='/' element={<NoteList 
        notes={notesWithTags}
        availableTags={tags}
        onUpdateTag={updateTag}
        onDeleteTag={deleteTag}
        setNote = {setNote}
        />}></Route>
        
        <Route path='*' element={<Navigate to='/' />}></Route>
        <Route path='/new' element={<NotesForm onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags}/>}></Route>
        <Route path='/:id' element={<NoteLayout notes={notesWithTags} />}>
            <Route index element={<Note onDelete={onDeleteNote} />}/>
            <Route path='edit' element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags} />} />
        </Route>
        <Route path='*' element={<Navigate to='/' />}/>
      </Routes>
    </>
  )
}

export default App;
