import React, { useState } from 'react';
import type { AppProps, StickyNote } from './types';

const colors = {
  yellow: 'bg-yellow-200',
  pink: 'bg-pink-200',
  green: 'bg-green-200',
  blue: 'bg-blue-200',
  purple: 'bg-purple-200'
} as const;

const ZStickies: React.FC<AppProps> = ({ className }) => {
  const [notes, setNotes] = useState<StickyNote[]>([
    { id: '1', content: 'Welcome to Stickies!', color: 'yellow', position: { x: 20, y: 20 } },
    { id: '2', content: 'Click + to add a new note', color: 'pink', position: { x: 220, y: 40 } },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addNote = () => {
    const colorKeys = Object.keys(colors) as Array<keyof typeof colors>;
    const randomColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    const newNote: StickyNote = {
      id: Date.now().toString(),
      content: '',
      color: randomColor,
      position: { x: 50 + Math.random() * 100, y: 50 + Math.random() * 100 }
    };
    setNotes(prev => [...prev, newNote]);
    setSelectedId(newNote.id);
  };

  const updateNote = (id: string, content: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, content } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const changeColor = (id: string) => {
    const colorKeys = Object.keys(colors) as Array<keyof typeof colors>;
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        const currentIdx = colorKeys.indexOf(n.color);
        const nextColor = colorKeys[(currentIdx + 1) % colorKeys.length];
        return { ...n, color: nextColor };
      }
      return n;
    }));
  };

  return (
    <div className={`relative h-full bg-[#2a2a2a] overflow-hidden ${className || ''}`}>
      {/* Toolbar */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#3a3a3a] flex items-center px-4 gap-2 z-10">
        <button
          onClick={addNote}
          className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center text-black font-bold hover:bg-yellow-300"
        >
          +
        </button>
        <span className="text-gray-400 text-sm">Click to add a sticky note</span>
      </div>

      {/* Notes */}
      <div className="absolute inset-0 pt-10">
        {notes.map(note => (
          <div
            key={note.id}
            className={`absolute w-48 ${colors[note.color]} shadow-lg rounded-sm cursor-move`}
            style={{ left: note.position.x, top: note.position.y }}
            onClick={() => setSelectedId(note.id)}
          >
            {/* Note header */}
            <div className="flex items-center justify-between px-2 py-1 border-b border-black/10">
              <button
                onClick={(e) => { e.stopPropagation(); changeColor(note.id); }}
                className="w-4 h-4 rounded-full bg-black/20 hover:bg-black/30"
                title="Change color"
              />
              <button
                onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                className="text-black/40 hover:text-black/60 font-bold"
              >
                ×
              </button>
            </div>
            {/* Note content */}
            <textarea
              value={note.content}
              onChange={(e) => updateNote(note.id, e.target.value)}
              className="w-full h-32 p-2 bg-transparent resize-none outline-none text-sm"
              placeholder="Type here..."
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZStickies;
