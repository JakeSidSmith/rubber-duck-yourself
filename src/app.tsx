import { ENTER_KEY_CODE, GREETINGS } from '^/constants';
import { pickRandom } from '^/utils';
import React, { Component } from 'react';

interface AppState {
  value: string;
  lastMessages: string[];
  nextMessage: string;
  conversation: MessageProps[];
}

interface MessageProps {
  text: string;
  bot: boolean;
}

// tslint:disable-next-line:variable-name
const Message = ({ text, bot }: MessageProps) => {
  return (
    <div>
      <strong>{bot ? 'Ducky' : 'You'}</strong>
      <p>{text}</p>
    </div>
  );
};

export default class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      lastMessages: [],
      nextMessage: pickRandom(GREETINGS),
      value: '',
      conversation: [],
    };
  }

  public render() {
    return (
      <div className="container">
        <div className="conversation">
          {this.state.conversation.map(Message)}
        </div>
        <form onSubmit={this.onSubmit}>
          <textarea
            value={this.state.value}
            onKeyDown={this.onKeyPress}
            onChange={this.onChange}
          />
        </form>
      </div>
    );
  }

  private onSubmit = (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    const [, ...lastMessages] = this.state.lastMessages;

    this.setState({
      lastMessages: [...lastMessages, this.state.value],
      conversation: [
        ...this.state.conversation,
        {
          bot: false,
          text: this.state.value,
        },
      ],
      value: '',
    });
  };

  private onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      value: event.target.value,
    });
  };

  private onKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === ENTER_KEY_CODE && !event.shiftKey) {
      this.onSubmit();
    }
  };
}
