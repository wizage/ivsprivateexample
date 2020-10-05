/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import API from '@aws-amplify/api';

export default class SubscribePopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      item: { },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { displayingSubscribe, choosenItem, error } = nextProps;
    return {
      show: displayingSubscribe,
      item: choosenItem,
      error: error
    };
  }

  subscribe = (item) => {
    const apiName = 'SubscriptionEndpoint';
    const path = 'subscribe';
    const postDict = {
      body: {
        userId:'12345', 
        channelId:item.id
      }
    }
    API.post(apiName, path, postDict)
    .then(response => {
      // Add your code here
      this.setState({
          items: response,
      });
      console.log(response);
    })
    .catch(error => {
      console.log(error.response);
    });
  }

  render() {
    const {
      hideSubscribe,
    } = this.props;
    const { show, item, item: {name} } = this.state;
    console.log(item);
    return (
    <Modal centered show={show} onHide={hideSubscribe}>
        <Modal.Header closeButton>{(name !== '')? name : 'No title'}</Modal.Header>
        <Modal.Body>
          You are not subscribed. <p/> Would you like to subscribe now?
          <p/>
          <Button onClick={(e)=> this.subscribe(item,e)}>
            Subscribe
          </Button>
        </Modal.Body>
      </Modal>
    );
  }
}
