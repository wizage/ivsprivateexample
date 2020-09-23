import React, { Component } from 'react';
import API from '@aws-amplify/api';
import {CardDeck, Card, Button} from 'react-bootstrap';
import VideoPopover from '../VideoPopover';


class GridView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayingStream: false,
      choosenItem: {},
      nextToken: '',
      sources: [],
      items: [],
    };
  }

  async componentDidMount() {
    const apiName = 'SubscriptionEndpoint';
    const path = '/listChannels'; 
    API.get(apiName, path, {})
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

  displayStream = (item) => {
    const apiName = 'SubscriptionEndpoint';
    const path = '/token';
    const params = {
      headers: {}, // OPTIONAL
      queryStringParameters: {
        userId: '12345',
        channelId: item.id,
      },
    };
    API.get(apiName, path, params)
    .then(response => {
      item.token = response.token;
      item.url = response.url;
      this.setState({
        displayingStream: true,
        choosenItem: item,
      });
      console.log(response);
    })
    .catch(error => {
      this.setState({
        displaySubscribe: true,
        choosenItem: item,
      });
      console.log(error.response);
    });
    
  }

  hideStream = () => {
    this.setState({
      displayingStream: false,
    });
  }

  render() {
    const { items, choosenItem, displayingStream } = this.state;
    const itemHTML = items.map((item) => (
        <Card style={{ width: '18rem'}}>
            <Card.Body>
                <Card.Title>{(item.name !=='')? item.name : 'No title'}</Card.Title>
                <Button onClick={(e)=> this.displayStream(item,e)}>
                    Watch
                </Button>
            </Card.Body>
        </Card>
    ));

    return (
      <div>
          <VideoPopover 
            choosenItem={choosenItem}
            displayingStream={displayingStream}
            hideStream={this.hideStream}
          />
          <CardDeck>
            {itemHTML}
          </CardDeck>
      </div>
    );
  }
}

export default GridView;