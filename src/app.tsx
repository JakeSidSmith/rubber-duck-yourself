import {
  ENTER_KEY_CODE,
  GREETINGS,
  INITIAL_MESSAGES,
  INITIAL_QUESTIONS,
  LONG_MESSAGES,
  STANDARD_MESSAGES,
} from '^/constants';
import { pickPseudoRandom, pickRandom } from '^/utils';
import React, { PureComponent } from 'react';

interface AppState {
  value: string;
  lastBotMessages: string[];
  lastUserMessage?: string;
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

    this.state = {
      lastBotMessages: [],
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
      lastUserMessage: this.state.value,
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

    const message = this.pickNewMessage(this.state.lastBotMessages);

    this.timeout = window.setTimeout(
      () => this.sendNewMessage(message),
      200 + message.length * 50
    );
  }

  private pickNewMessage(lastBotMessages: string[]) {
    const { length: conversationLength } = this.state.conversation;

    if (lastBotMessages.length === 0) {
      return pickRandom(GREETINGS);
    }

    if (lastBotMessages.length === 1) {
      return pickPseudoRandom(INITIAL_MESSAGES, lastBotMessages);
    }

    if (lastBotMessages.length === 2) {
      return pickRandom(INITIAL_QUESTIONS);
    }

    if (
      conversationLength > 10 &&
      this.state.lastUserMessage &&
      this.state.lastUserMessage.length >= 50
    ) {
      console.log('LONG');
      return pickPseudoRandom(LONG_MESSAGES, lastBotMessages);
    }

    return pickPseudoRandom(STANDARD_MESSAGES, lastBotMessages);
  }

  private sendNewMessage = (message: string) => {
    const lastLastBotMessages = this.state.lastBotMessages;
    const lastBotMessages = [
      ...lastLastBotMessages.slice(
        lastLastBotMessages.length > 4 ? lastLastBotMessages.length - 4 : 0
      ),
      message,
    ];

    this.setState({
      typing: false,
      lastBotMessages,
      conversation: [
        ...this.state.conversation,
        {
          text: message,
          bot: true,
        },
      ],
    });

    if (this.state.lastBotMessages.length === 2) {
      this.queueNewMessage();
    }
  };
}
