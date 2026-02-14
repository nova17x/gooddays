'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-bg p-4">
                    <div className="max-w-md w-full bg-bg-card border border-red-200 rounded-2xl p-6 shadow-sm text-center">
                        <h2 className="text-xl font-bold text-red-600 mb-4">
                            予期せぬエラーが発生しました
                        </h2>
                        <p className="text-text-muted mb-6 text-sm">
                            申し訳ありません。アプリで問題が発生しました。<br />
                            再読み込みを試してみてください。
                        </p>
                        {this.state.error && (
                            <pre className="text-xs text-left bg-gray-100 p-2 rounded mb-4 overflow-auto max-h-32 text-red-500">
                                {this.state.error.message}
                            </pre>
                        )}
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="px-5 py-2 rounded-full bg-warm-500 text-white text-sm font-medium hover:bg-warm-600 transition-colors"
                        >
                            ページを再読み込み
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
