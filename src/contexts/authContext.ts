import { createContext } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});

// 定义题目类型
export interface Question {
  id: string;
  type: '单选题';
  content: string;
  answer: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  explanation: string;
}

// 定义用户答题记录类型
export interface AnswerRecord {
  id: string;
  name: string;
  answers: Record<string, string>;
  score: number;
  time: Date;
}