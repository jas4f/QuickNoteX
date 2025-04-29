import { Badge, Button, Row ,Col , Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"
import { useNote } from "./NoteLayout";
// import {ReactMarkdown} from 'react-markdwon'

type NoteProps = {
    onDelete : (id : string) => void
}
export const Note = ({onDelete} : NoteProps) => {
    const note = useNote()
    const navigate = useNavigate()

return(
  <>
  <Row className="align-items-center mb-4">
    <Col>
    <h1>{note.title}</h1>
    {note.tags.length > 0 && (
        <Stack gap={1} direction="horizontal" className="flex-wrap">
            {note.tags.map(tag=>{
                return (<Badge className="text-truncate" key={tag.id}>
                    {tag.label}
                </Badge>)
            })}
        </Stack>
    )}
    </Col>
    <Col>
    <Stack>
        <Link to={`/${note.id}/edit`}>
        <Button
        variant="primary"
        >
            Edit
        </Button>
        </Link>
        <Button
        onClick={()=>{
            onDelete(note.id)
            navigate("/")
        }}
        variant="outline-danger"
        >
            Delete
        </Button>

        <Link to='/'>
        <Button variant="outline-secondary">Back</Button>
        </Link>
    </Stack>
    </Col>
  </Row>
 {/* <ReactMarkdown>{note.markdown}</ReactMarkdown> */}
  </>
)
};
