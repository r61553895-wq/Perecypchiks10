import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-zinc-50 p-4 font-sans text-zinc-900">
          <div className="max-w-md w-full p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-zinc-900 mb-2">Ошибка при загрузке данных</h1>
            <p className="text-xs text-zinc-500 mb-6">
              Произошла непредвиденная ошибка при инициализации интерфейса. Нажмите кнопку ниже, чтобы сбросить повреждённые данные и перезагрузить симулятор.
            </p>
            {this.state.error && (
              <pre className="p-3 bg-zinc-100 rounded-lg text-left text-[11px] font-mono text-zinc-700 overflow-x-auto mb-6 max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Сбросить и перезапустить симулятор</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
