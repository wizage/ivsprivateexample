/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import VideoPlayer from '../VideoPlayer';

export default class VideoPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      item: { },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { displayingStream, choosenItem, error } = nextProps;
    return {
      show: displayingStream,
      item: choosenItem,
      error: error
    }
  }

  showVideoPlayer = () => {
    const {error, item: {url, token} }= this.state;
    if ( error ) {
      return(
        <div>
          Please Subscribe
          <Button>Subscribe</Button>
        </div>
      );
    }
    return (
      <VideoPlayer
        // token={'test'}
        bigPlayButton={false}
        src={`${url}?token${token}`}
        techOrder={['AmazonIVS']}
      />
    );
  }

  render() {
    const {
      hideStream,
    } = this.props;
    const { show, item: {name} } = this.state;
    return (
    <Modal centered show={show} onHide={hideStream}>
        <Modal.Header closeButton>{(name !== '')? name : 'No title'}</Modal.Header>
        <Modal.Body>
          {this.showVideoPlayer()}
        </Modal.Body>
      </Modal>
    );
  }
}
