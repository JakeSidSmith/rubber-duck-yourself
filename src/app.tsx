import {
  ENTER_KEY_CODE,
  GREETINGS,
  INITIAL_MESSAGES,
  STANDARD_MESSAGES,
} from '^/constants';
import { pickPseudoRandom, pickRandom } from '^/utils';
import React, { PureComponent } from 'react';

interface AppState {
  value: string;
  lastMessages: string[];
  nextMessage: string;
  conversation: MessageProps[];
  typing: boolean;
}

interface MessageProps {
  text: string;
  bot: boolean;
}

// tslint:disable-next-line:variable-name
const Message = ({ text, bot }: MessageProps) => {
  return (
    <div className="message">
      <p className="user">{bot ? 'Ducky' : 'You'}</p>
      <p className="text">{text}</p>
    </div>
  );
};

export default class App extends PureComponent<{}, AppState> {
  private timeout?: number;
  private conversation?: HTMLDivElement;

  public constructor(props: any) {
    super(props);

    const nextMessage = pickRandom(GREETINGS);

    this.state = {
      lastMessages: [],
      nextMessage,
      value: '',
      conversation: [],
      typing: false,
    };
  }

  public componentDidMount() {
    this.queueNewMessage();
  }

  public componentDidUpdate() {
    if (this.conversation) {
      const scrollFromBottom = Math.abs(
        this.conversation.scrollHeight -
          this.conversation.offsetHeight -
          this.conversation.scrollTop
      );

      if (scrollFromBottom <= 100) {
        this.conversation.scrollTop = this.conversation.scrollHeight;
      }
    }
  }

  public render() {
    return (
      <div className="container">
        <div className="conversation" ref={this.getConversation}>
          <div className="messages">
            {this.state.conversation.map(Message)}
            {this.state.typing && <p className="typing">Typing...</p>}
          </div>
        </div>
        <form className="form" onSubmit={this.onSubmit}>
          <textarea
            className="textarea"
            placeholder="Type your message here"
            value={this.state.value}
            onKeyDown={this.onKeyPress}
            onChange={this.onChange}
          />
        </form>
      </div>
    );
  }

  private getConversation = (element: HTMLDivElement) => {
    this.conversation = element;
  };

  private onSubmit = (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (this.conversation) {
      this.conversation.scrollTop = this.conversation.scrollHeight;
    }

    this.setState({
      conversation: [
        ...this.state.conversation,
        {
          bot: false,
          text: this.state.value,
        },
      ],
      value: '',
    });

    this.queueNewMessage();
  };

  private onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    window.clearTimeout(this.timeout);

    this.setState({
      typing: false,
      value: event.target.value,
    });
  };

  private onKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === ENTER_KEY_CODE && !event.shiftKey) {
      event.preventDefault();
      this.onSubmit();
    }
  };

  private queueNewMessage() {
    window.clearTimeout(this.timeout);

    this.setState({
      typing: true,
    });

    this.timeout = window.setTimeout(
      this.sendNewMessage,
      200 + this.state.nextMessage.length * 50
    );
  }

  private sendNewMessage = () => {
    const lastLastMessages = this.state.lastMessages;
    const lastMessages = [
      ...lastLastMessages.slice(
        lastLastMessages.length > 4 ? lastLastMessages.length - 4 : 0
      ),
      this.state.nextMessage,
    ];

    this.setState({
      typing: false,
      lastMessages,
      conversation: [
        ...this.state.conversation,
        {
          text: this.state.nextMessage,
          bot: true,
        },
      ],
      nextMessage: pickPseudoRandom(
        this.state.conversation.length > 1
          ? STANDARD_MESSAGES
          : INITIAL_MESSAGES,
        lastMessages
      ),
    });
  };
}
