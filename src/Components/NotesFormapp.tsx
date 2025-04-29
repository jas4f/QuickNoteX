 import NotesInput from "./NotesInput";
 import { Tag } from "../App";
 import { NoteData } from "../App";

export type NotesInputProps = {
   onSubmit : (data : NoteData) => void
   onAddTag : (tag : Tag) => void
   availableTags : Tag[]
 } & Partial<NoteData>
 
 const NotesForm = ({onSubmit, onAddTag, availableTags} : NotesInputProps) => {
  return(
    <> 
    <h1 className="mb-4">New Note</h1>
    <NotesInput onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags}/> 
    </>
  )
};

export default  NotesForm;