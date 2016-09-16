# Jenkins Notifications

This extension receives messages from Jenkins plugin [Notification plugin](https://wiki.jenkins-ci.org/display/JENKINS/Notification+Plugin) by HTTP and displays notifications in the message tray of Gnome Shell.

HTTP-server accepts connections on 127.0.0.1:8123.

## Installation from source

```
git clone http://github.com/alxrem/gnome-shell-jenkins-notifications \
	~/.local/share/gnome-shell/extensions/jenkins-notification@remizov.org
```

Reload Shell by pressing `Alt-F2 r Enter` and enable the extension with `gnome-tweak-tool`.

## Configuration of Jenkins

Install [Notification plugin](https://wiki.jenkins-ci.org/display/JENKINS/Notification+Plugin).

Scroll job settings page until the section `Job Notification` and press the button `Add Endpoint`. Set required parameters

```
Format    JSON
Protocol  HTTP
URL       http://localhost:8123/
```
