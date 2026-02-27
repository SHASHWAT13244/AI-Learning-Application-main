import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AiServices from '../../services/AiServices';
import type { chatMessagesType } from '../../types';
import { MessageSquare, Send, Sparkles } from 'lucide-react';
import Spinner from '../common/Spinner';
import { MarkDownRendererCompo } from '../common/MarkDownRendererCompo';

export const ChatInterface = () => {
    const { id: documentId } = useParams();
    const { user } = useAuth();
    const [histrory, setHistory] = useState<chatMessagesType[]>([]);
    const [messages, setMessages] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const messageEndRef = useRef<HTMLInputElement | null>(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    //get chats
    useEffect(() => {
        const fetchChathistory = async () => {
            if (!documentId) return;
            setInitialLoading(true);
            try {
                const response = await AiServices.getChatHistory(documentId);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch chat history', error);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchChathistory();
    }, [documentId]);

    useEffect(() => {
        scrollToBottom();
    }, [histrory]);

    const handleSendMessages = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!documentId || !messages.trim()) return;

        const userMessage: chatMessagesType = {
            role: 'user',
            content: messages,
            timestamp: new Date(),
        };
        setHistory(prev => [...prev, userMessage]);
        setMessages('');
        setLoading(true);

        try {
            const response = await AiServices.chat(
                documentId,
                userMessage.content
            );
            const assistantMessage: chatMessagesType = {
                role: 'assistant',
                content: response.data.answer,
                timestamp: new Date(),
                releventChunks: response.data.releventChunks,
            };
            setHistory(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error', error);
            const errMsg: chatMessagesType = {
                role: 'assistant',
                content: 'Sorry, I encountered an error.Please try again!',
                timestamp: new Date(),
            };
            setHistory(prev => [...prev, errMsg]);
        } finally {
            setLoading(false);
        }
    };
    const renderMessages = (msg: chatMessagesType, index: number) => {
        const isUserCheck = msg.role === 'user';
        return (
            <div
                key={index}
                className={`flex items-start gap-3 my-4 ${
                    isUserCheck ? 'justify-end' : ''
                }`}
            >
                {!isUserCheck && (
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-500/25 flex items-center justify-center shrink-0">
                        <Sparkles
                            className="w-4 h-4 text-white"
                            strokeWidth={2}
                        />
                    </div>
                )}

                <div
                    className={`max-w-lg p-4 rounded-2xl shadow-sm ${
                        isUserCheck
                            ? 'bg-linear-to-br from-emerald-500 to-teal-500 rounded-br-md text-white'
                            : 'bg-white border border-slate-200/60 text-slate-800 rounded-bl-md'
                    }`}
                >
                    {isUserCheck ? (
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                    ) : (
                        <div className="prose prose-sm max-w-none prose-slate">
                            <MarkDownRendererCompo content={msg.content} />
                        </div>
                    )}
                </div>
                {isUserCheck && (
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-700 font-semibold text-sm shrink-0 shadow-sm">
                        {user?.username.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
            </div>
        );
    };

    if (initialLoading) {
        return (
            <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl items-center justify-center shadow-xl shadow-slate-200/50">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-6">
                    <MessageSquare
                        className="w-7 h-7 text-emerald-600"
                        strokeWidth={2}
                    />
                </div>
                <Spinner height="h-auto" />
                <p className="text-sm text-slate-500 mt-4 font-medium">
                    Loading Chat history...
                </p>
            </div>
        );
    }
    return (
        <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
            {/* Message Area  */}
            <div className="flex-1 p-6 overflow-y-auto bg-linear-to-br from-slate-50/50 via-white/50 to-slate-50/50">
                {histrory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/50">
                            <MessageSquare
                                className="w-8 h-8 text-emerald-600"
                                strokeWidth={2}
                            />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 mb-2">
                            Start a Conversation
                        </h3>
                        <p className="text-sm text-slate-500">
                            Ask me anything about the docuemnt!
                        </p>
                    </div>
                ) : (
                    histrory.map(renderMessages)
                )}
                <div ref={messageEndRef} />
                {loading && (
                    <div className="flex items-center gap-3 my-4">
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/50 flex items-center shrink-0">
                            <Sparkles
                                className="w-4 h-4 text-white"
                                strokeWidth={2}
                            />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-md bg-white border-slate-200/60">
                            <div className="flex gap-1">
                                <span
                                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                    style={{ animationDelay: '0ms' }}
                                ></span>
                                <span
                                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                    style={{ animationDelay: '150ms' }}
                                ></span>
                                <span
                                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                    style={{ animationDelay: '300ms' }}
                                ></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area  */}
            <div className="p-5 border-t border-slate-200/60 bg-white/80">
                <form
                    onSubmit={handleSendMessages}
                    className="flex items-center gap-3"
                >
                    <input
                        type="text"
                        value={messages}
                        placeholder="Ask me a questions..."
                        disabled={loading}
                        onChange={e => setMessages(e.target.value)}
                        className="flex-1 h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/50"
                    />
                    <button
                        type="submit"
                        disabled={loading || !messages.trim()}
                        className="shrink-0 w-12 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
                    >
                        <Send className="w-5 h-5" strokeWidth={2} />
                    </button>
                </form>
            </div>
        </div>
    );
};
