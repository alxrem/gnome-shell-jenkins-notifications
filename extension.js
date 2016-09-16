/* vim: ts=4 sts=4 sw=4 et
 *
 * Jenkins notifications extension for gnome-shell
 * Copyright (C) 2016  Alexey Remizov
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

const Soup = imports.gi.Soup;
const Gio = imports.gi.Gio;

const Main = imports.ui.main;
const MessageTray = imports.ui.messageTray;

const Icons = {
    'SUCCESS': new Gio.ThemedIcon({name: 'dialog-information'}),
    'FAILURE': new Gio.ThemedIcon({name: 'dialog-error'}),
    default:   new Gio.ThemedIcon({name: 'dialog-warning'})
};

let Server;

function handleNotification(server, msg, query, client, user_data) {
    let source = new MessageTray.Source('jenkins-notifications');
    Main.messageTray.add(source);

    let requestData = msg.request_body.flatten().get_data().toString();
    let data = JSON.parse(requestData);
    let title = data.name;
    let icon = Icons[data.build.status] || Icons.default;
    let consoleOutputUrl = data.build.full_url + 'console';

    let message = data.build.phase;
    if (data.build.status) {
        message += ' ' + data.build.status;
    }

    let notification = new MessageTray.Notification(source);
    notification.update(title, message, {gicon: icon});
    notification.addAction("Console output", function() {
        Gio.app_info_launch_default_for_uri(
            consoleOutputUrl,
            global.create_app_launch_context(0, -1)
        );
    });
    source.notify(notification);

    msg.set_status(200);
}

function enable() {
    Server = new Soup.Server;
    Server.listen_local(8123, 0);
    Server.add_handler('/', handleNotification, null)
}

function disable() {
    Server.disconnect();
    Server = null;
}
