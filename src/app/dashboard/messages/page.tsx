"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Search, Bell } from "lucide-react"

export default function MessagesPage() {
  const supabase = createClient()
  const [contacts, setContacts] = useState<any[]>([])
  const [activeContact, setActiveContact] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [messageText, setMessageText] = useState("")
  const [myUserId, setMyUserId] = useState<string | null>(null) // We'll pretend we are the first user for prototype
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchUsersAndMessages()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function fetchUsersAndMessages() {
    // For prototype purposes, let's just fetch all users
    const { data: usersData } = await supabase.from('users').select('*')
    
    // If we have no users, we'll create some dummy ones to play with
    let usersList = usersData || []
    
    if (usersList.length === 0) {
      // Create some dummy users so the UI works
      const dummyUsers = [
        { email: 'admin@test.com', full_name: 'Principal Admin', role: 'admin' },
        { email: 'parent1@test.com', full_name: 'Mr. Rahman (Aarav\'s Dad)', role: 'parent' },
        { email: 'parent2@test.com', full_name: 'Mrs. Khan (Zara\'s Mom)', role: 'parent' }
      ]
      // We can't insert into auth.users easily from client, so we will just use a mock fallback if DB is totally empty
      setContacts([
        { id: "1", full_name: "Mr. Rahman (Aarav's Dad)", role: "parent" },
        { id: "2", full_name: "Mrs. Khan (Zara's Mom)", role: "parent" },
      ])
      return
    }

    // Pretend the first admin is "me"
    const me = usersList.find(u => u.role === 'admin' || u.role === 'super_admin') || usersList[0]
    setMyUserId(me.id)

    // The rest are contacts
    const others = usersList.filter(u => u.id !== me.id)
    setContacts(others)
    if (others.length > 0) {
      loadChat(others[0].id, me.id)
    }
  }

  async function loadChat(contactId: string, currentUserId: string | null) {
    const contact = contacts.find(c => c.id === contactId) || contacts[0]
    setActiveContact(contact)
    
    if (!currentUserId) return // Prototype mode fallback

    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${currentUserId})`)
      .order('sent_at', { ascending: true })
    
    if (data) setMessages(data)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !activeContact) return
    
    const textToSend = messageText
    setMessageText("") // optimistic clear

    // If we are in prototype fallback mode (no DB users)
    if (!myUserId) {
      setMessages([...messages, { id: Date.now().toString(), sender_id: 'me', content: textToSend, sent_at: new Date().toISOString() }])
      return
    }

    // Insert to DB
    const { data, error } = await supabase.from('messages').insert([
      {
        sender_id: myUserId,
        receiver_id: activeContact.id,
        content: textToSend
      }
    ]).select().single()

    if (data) {
      setMessages([...messages, data])
    }
  }

  const getTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Messages & Notifications</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Broadcast Announcement
        </Button>
      </div>

      <Card className="flex-1 shadow-sm border-0 ring-1 ring-slate-200 overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar / Contacts List */}
        <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search messages..." className="pl-9 bg-white" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  setActiveContact(contact)
                  if (myUserId) loadChat(contact.id, myUserId)
                }}
                className={`w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-slate-100 border-b border-slate-100 ${
                  activeContact?.id === contact.id ? "bg-white border-l-4 border-l-orange-500" : ""
                }`}
              >
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.full_name}`} />
                  <AvatarFallback>{contact.full_name?.substring(0, 2) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{contact.full_name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 capitalize">{contact.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeContact ? (
            <>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeContact.full_name}`} />
                    <AvatarFallback>{activeContact.full_name?.substring(0, 2) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900">{activeContact.full_name}</h3>
                    <p className="text-xs text-slate-500 capitalize">{activeContact.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender_id === myUserId || msg.sender_id === 'me'
                    return (
                      <div key={msg.id} className={`flex flex-col max-w-[70%] ${isMe ? "self-end items-end ml-auto" : "self-start items-start"}`}>
                        <div className={`p-3 rounded-2xl ${isMe ? "bg-orange-500 text-white rounded-br-sm" : "bg-slate-100 text-slate-800 rounded-bl-sm"}`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1">{getTime(msg.sent_at)}</span>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <form onSubmit={handleSend} className="flex gap-2">
                  <Textarea 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..." 
                    className="min-h-[44px] h-[44px] resize-none bg-white py-3"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend(e)
                      }
                    }}
                  />
                  <Button type="submit" size="icon" className="h-[44px] w-[44px] bg-orange-500 hover:bg-orange-600 shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-4">
              <Send className="w-12 h-12 text-slate-300" />
              <p>Select a contact to start messaging</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
