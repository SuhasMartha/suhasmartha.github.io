import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ContentCalendar = ({ posts, onEditPost, onNewPost }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getPostsForDate = (day) => {
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateString = targetDate.toDateString();

        return posts.filter(post => {
            const postDate = new Date(post.date || post.created_at);
            return postDate.toDateString() === dateString;
        });
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for days before start of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 border-b border-r border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            const isSelected = selectedDate.toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            const dayPosts = getPostsForDate(day);

            days.push(
                <div
                    key={day}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={`h-24 border-b border-r border-gray-100 dark:border-gray-800 p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer relative group ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                        }`}
                >
                    <div className="flex justify-between items-start">
                        <span className={`text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-lhilit-1 text-white' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                            {day}
                        </span>
                        {dayPosts.length > 0 && (
                            <span className="text-[10px] font-bold text-gray-400">
                                {dayPosts.length}
                            </span>
                        )}
                    </div>

                    <div className="mt-1 space-y-1 overflow-y-auto max-h-[50px] custom-scrollbar">
                        {dayPosts.map((post) => (
                            <div
                                key={post.id}
                                onClick={(e) => { e.stopPropagation(); onEditPost(post); }}
                                className={`text-[10px] p-1 rounded truncate border ltr text-left transition-all hover:scale-[1.02] ${post.published === false
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/50'
                                    : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/50'
                                    }`}
                                title={post.title}
                            >
                                {post.title}
                            </div>
                        ))}
                    </div>

                    {/* Add button on hover */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNewPost(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                        }}
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 hover:scale-110 transition-all"
                        title="Schedule Post"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            );
        }

        return days;
    };

    const selectedDayPosts = getPostsForDate(selectedDate.getDate());

    // Task Management Logic
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('admin_tasks');
        return saved ? JSON.parse(saved) : [];
    });
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        localStorage.setItem('admin_tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        const task = {
            id: Date.now(),
            text: newTask,
            completed: false,
            date: new Date().toISOString()
        };
        setTasks([task, ...tasks]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Tasks Section (Sidebar) - Now on Left */}
            <div className="w-full lg:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[500px] lg:h-auto overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
                    <h2 className="font-bold text-gray-900 dark:text-gray-100">Tasks</h2>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                        {tasks.filter(t => !t.completed).length} pending
                    </span>
                </div>

                {/* Task Input - Moved to Top */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <form onSubmit={addTask} className="relative">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add a new task..."
                            className="w-full pl-4 pr-12 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!newTask.trim()}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-colors flex items-center justify-center w-7 h-7"
                        >
                            +
                        </button>
                    </form>
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                    {tasks.length === 0 && (
                        <div className="text-center py-6 text-gray-400 text-sm">
                            <p>No tasks yet.</p>
                            <p className="text-xs mt-1">Add one above!</p>
                        </div>
                    )}
                    {tasks.map(task => (
                        <div key={task.id} className="group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all">
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.completed
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-gray-300 dark:border-gray-500 text-transparent hover:border-green-500'
                                    }`}
                            >
                                ✓
                            </button>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm break-words ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {task.text}
                                </p>
                            </div>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Calendar Section (Flexible Grow) - Now on Right */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <span className="text-blue-500">📅</span>
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-0.5">
                            <button onClick={prevMonth} className="px-2 py-1 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all shadow-sm">
                                ←
                            </button>
                            <button onClick={nextMonth} className="px-2 py-1 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-all shadow-sm">
                                →
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex gap-3 text-xs font-medium">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-800">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Published
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-100 dark:border-yellow-800">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Draft
                            </div>
                        </div>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:shadow-sm transition-all"
                        >
                            Today
                        </button>
                    </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 text-center py-3 bg-gray-50 dark:bg-gray-800">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 flex-1 bg-gray-100/50 dark:bg-gray-900/50">
                    {renderCalendarDays()}
                </div>

                {/* Footer / Selected Day */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <span className="text-gray-400">Selected:</span>
                            {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </h3>
                        <button
                            onClick={() => onNewPost(selectedDate)}
                            className="text-xs flex items-center gap-1 bg-lhilit-1 text-white px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                        >
                            + Schedule Post
                        </button>
                    </div>

                    {selectedDayPosts.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No posts scheduled for this day.</p>
                    ) : (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {selectedDayPosts.map(post => (
                                <div
                                    key={post.id}
                                    onClick={(e) => { e.stopPropagation(); onEditPost(post); }}
                                    className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 group"
                                >
                                    <span className={`w-2 h-2 rounded-full ${post.published !== false ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                    <span className="truncate max-w-[120px] font-medium">{post.title}</span>
                                    <span className="text-gray-300 group-hover:text-blue-500">✎</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentCalendar;
