/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import VideoPlayer from '../VideoPlayer';
import API from '@aws-amplify/api';

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
    const {error, item: {url, token, authorized} }= this.state;
    if ( error ) {
      return(
        <div>
          Error please try again later.
        </div>
      );
    }
    return (
      <VideoPlayer
        bigPlayButton={false}
        src={`${url}`+(authorized)?`?token${token}`:''}
        techOrder={['AmazonIVS']}
      />
    );
  }

  unsubscribe = (item) => {
    const apiName = 'SubscriptionEndpoint';
    const { showVideo, hideSubscribe } = this.props;
    const path = 'unsubscribe';
    const postDict = {
      body: {
        userId:'123456', 
        channelId:item.id
      }
    }
    API.post(apiName, path, postDict)
    .then(response => {
      // Add your code here
      // hideSubscribe();
      // showVideo(item);
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  }

  render() {
    const {
      hideStream,
    } = this.props;
    const { show, item, item: {name} } = this.state;
    return (
    <Modal centered show={show} onHide={hideStream}>
        <Modal.Header closeButton>{(name !== '')? name : 'No title'}</Modal.Header>
        <Modal.Body>
          {this.showVideoPlayer()}
          <br/>
          <Button onClick={(e)=> this.unsubscribe(item,e)}>
            Unsubscribe
          </Button>
        </Modal.Body>
      </Modal>
    );
  }
}
