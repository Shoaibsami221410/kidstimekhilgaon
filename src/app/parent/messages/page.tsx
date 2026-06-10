"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, User } from "lucide-react"

export default function ParentMessagesPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Admin', content: 'Welcome to Kids Time Khilgaon! Let us know if you need any help with enrollment.', time: '10:00 AM, Today', isMe: false },
    { id: 2, sender: 'You', content: 'Thank you! I will fill out the admission form shortly.', time: '10:30 AM, Today', isMe: true }
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    
    setMessages([...messages, {
      id: Date.now(),
      sender: 'You',
      content: newMessage,
      time: 'Just now',
      isMe: true
    }])
    setNewMessage("")
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Messages</h1>
        <p className="text-slate-500">Communicate directly with our teachers and administrative staff.</p>
      </div>

      <Card className="flex-1 flex flex-col shadow-sm border-0 ring-1 ring-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50 border-b flex flex-row items-center gap-3 py-4">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base">Kids Time Support</CardTitle>
            <p className="text-xs text-slate-500">Usually replies within a few hours</p>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-end gap-2 mb-1">
                {!msg.isMe && (
                  <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center mb-1 shrink-0">
                    <User className="w-3 h-3 text-slate-500" />
                  </div>
                )}
                <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] sm:max-w-md ${
                  msg.isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 px-8">{msg.time}</span>
            </div>
          ))}
        </CardContent>

        <div className="p-4 bg-white border-t">
          <form onSubmit={handleSend} className="flex gap-2">
            <Textarea 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..." 
              className="resize-none h-12 min-h-0 bg-slate-50 border-slate-200"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <Button type="submit" size="icon" className="h-12 w-12 bg-blue-600 hover:bg-blue-700 shrink-0">
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
