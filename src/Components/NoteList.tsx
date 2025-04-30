import { useMemo, useState } from "react";
import { Button, Row ,Col,Stack,Form,Modal,Card,Badge} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from 'react-select';
import { Note, Tag, RawNote } from "../App";

type NoteListProps = {
    availableTags : Tag[]
    notes : Note[],
    setNote :RawNote[],
    onUpdateTag : (id : string, label : string) => void
    onDeleteTag : (id : string) => void
}
type EditTagsModalProps = {
    availableTags : Tag[]
    show : boolean
    onUpdateTag : (id:string , label:string) => void
    onDeleteTag : (id:string) => void
    handleClose: () => void

}

type DeleteAllModelProps = {
    show : boolean
    handleClose : () => void,
    handleDeleteAll : () => void
}

type SimplifiedNote = {
    id : string,
    tags : Tag[],
    title : string
}
  const  NoteList = ({
    notes,
    availableTags,
    onUpdateTag,
    onDeleteTag,
    setNote
 }:NoteListProps
 ) => {
    const [title,setTitle] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [eidtTagsModalIsOpen , setEditTagsModalIsOpen] = useState(false);
      const [show, setShow] = useState<boolean>(false);

    const filteredNotes = useMemo(()=>{
        return notes.filter(note=>{
            return(
                (title === "" ||
                    note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.length === 0 ||
                    selectedTags.every(tag=>
                        note.tags.some(noteTag => noteTag.id === tag.id)
                    ))
            )
        })
    },[title, selectedTags, notes])
    
     const handleClose = () => setShow(false);
     const handleShow = () => setShow(true);


    const handleDeleteAll = ()=>{
        handleClose();
         setNote([]);
    }
    return(

    <>
    <Row className="d-flex gap-5">
        <Col>
        <h2>Notes</h2>
        </Col>
        <Col>
        <Stack direction="horizontal" gap={5}>
            <Link to='/new'>
            <Button variant="primary">Create</Button>
            </Link>
            <Button onClick={()=> setEditTagsModalIsOpen(true)} variant="outline-secondary">
             Edit Tags
            </Button>
            <Button onClick={handleShow}>Delete All</Button>
        </Stack>
        </Col>
    </Row>

    <Form>
        <Row className="mb-4">
            <Col>
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={title} onChange={e=> setTitle(e.target.value)}></Form.Control>
            </Form.Group>
            </Col>
            <Col>
            <Form.Group controlId="tags">
                <Form.Label>
                    Tags
                </Form.Label>
                <ReactSelect 
                value={selectedTags.map(tag=>{
                    return {label : tag.label, value : tag.id}
                })}
                options={availableTags.map(tag =>{
                    return{ label : tag.label , value : tag.id}
                })}

                onChange={tags=>{
                    setSelectedTags(
                        tags.map(tag=>{
                            return {label : tag.label , id : tag.value}
                        })
                    )
                }}
                isMulti
                 />
            </Form.Group>
            </Col>
        </Row>
    </Form>
    <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
      {filteredNotes.map(note=>{
      return (<Col key={note.id}>
      <NoteCard id={note.id} title={note.title} tags={note.tags} />
      </Col>)
      })}
    </Row>
    <EditTagsModal 
    onUpdateTag={onUpdateTag}
    onDeleteTag = {onDeleteTag}
    show={eidtTagsModalIsOpen}
    handleClose = {()=> setEditTagsModalIsOpen(false)}
    availableTags={availableTags}
    />

    <DeleteAll 
    handleClose={handleClose}
    show={show}
    handleDeleteAll={handleDeleteAll}
    />
    </>
  )
};

const NoteCard = ({id,title,tags} : SimplifiedNote)=>{
    return(
        <Card 
        as={Link}
        to={`${id}`}
        className={`h-100 text-reset text-decoration-none `}
        >
            <Card.Body>
                <Stack gap={2} className="align-items-center justify-content-center h-100">
                    <span className="fs-5">{title}</span>
                    {tags.length > 0 && (
                        <Stack
                        gap={2}
                        direction="horizontal"
                        className="justify-content-center flex-wrap"
                        >
                            {tags.map(tag=>{
                                return (<Badge className="text-truncate" key={tag.id}>
                                    {tag.label}
                                </Badge>)
                            })}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    )
}

const EditTagsModal = ({onUpdateTag,onDeleteTag,show,handleClose,availableTags} : EditTagsModalProps)=>{
   return(
    <>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Stack gap={2}>
                    {availableTags.map(tag =>{
                    return(
                        <Row key={tag.id}>
                            <Col>
                            <Form.Control
                            type="text"
                            value={tag.label}
                            onChange={e=>onUpdateTag(tag.id,e.target.value)} 
                            />
                            </Col>
                            <Col xs='auto'>
                            <Button
                            onClick={()=> onDeleteTag(tag.id)}
                            variant="outline-danger"
                            >
                            &times;                               
                            </Button>
                            </Col>
                        </Row>)
                    })}
                </Stack>
            </Form>
        </Modal.Body>

    </Modal>
    </>
   )
}

const DeleteAll = ({handleClose,show, handleDeleteAll}: DeleteAllModelProps)=>{
    return(
        <>
         <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>DeleteAll</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you want to Delete All Notes ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDeleteAll}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
        </>
    )
}

 export default NoteList;