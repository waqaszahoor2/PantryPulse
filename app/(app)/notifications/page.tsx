"use client";

import { Bell, CheckCheck, CircleAlert, Info, TriangleAlert } from "lucide-react";
import { NotificationPermission } from "@/components/notifications/notification-permission";
import { usePantry } from "@/lib/data/provider";

const icons={urgent:CircleAlert,warning:TriangleAlert,info:Info,success:CheckCheck};
export default function NotificationsPage(){
 const {notifications,markNotificationRead,markAllNotificationsRead}=usePantry(); const unread=notifications.filter((note)=>!note.read).length;
 return <div className="page-stack"><section className="page-heading-row"><div><p className="eyebrow">Expiry reminders</p><h1>Notifications</h1><p>{unread} unread update{unread===1?"":"s"}.</p></div>{unread>0&&<button className="button button-soft" onClick={markAllNotificationsRead}><CheckCheck size={17}/> Mark all read</button>}</section><NotificationPermission/><section className="notification-list">{notifications.length?notifications.map((note)=>{const Icon=icons[note.type];return <article key={note.id} className={`notification-row ${note.read?"read":""}`}><span className={`notification-type ${note.type}`}><Icon/></span><div><div className="notification-heading"><h2>{note.title}</h2>{!note.read&&<span>New</span>}</div><p>{note.message}</p><small>{new Date(note.createdAt).toLocaleString()}</small></div>{!note.read&&<button className="button button-ghost button-small" onClick={()=>markNotificationRead(note.id)}>Mark read</button>}</article>}):<div className="empty-state"><span className="empty-icon"><Bell/></span><h3>No notifications yet</h3><p>Expiry reminders will appear here.</p></div>}</section><p className="safety-note"><Info size={15}/> Browser notifications require HTTPS and user permission. Closed-app push delivery needs a separate Web Push subscription service.</p></div>;
}
