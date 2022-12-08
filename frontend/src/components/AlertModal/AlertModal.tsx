import { Button, Modal } from 'react-bootstrap'

export interface IProps {
  header: string
  body: string | JSX.Element
  show: boolean
  hide: () => void
  handler?: () => void
}

const AlertModal = (props: IProps) => {
  return (
    <Modal show={props.show} onHide={() => props.hide()}>
      <Modal.Header closeButton>
        <Modal.Title>{props.header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>
        <Button variant={props.handler ? 'secondary' : 'primary'} onClick={() => props.hide()}>
          Close
        </Button>
        {props.handler
          ? <Button variant="primary" onClick={() => { props.handler?.(); props.hide() }}>
              Confirm
            </Button>
          : null
        }
      </Modal.Footer>
    </Modal>
  )
}

export default AlertModal
