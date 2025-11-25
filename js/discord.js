/**
 * Renders the Discord user's status and activity in the widget.
 * NOTE: Depends on 'LANYARD_API_URL' (from constants.js).
 * @param {object} data - Data object from Lanyard API.
 */
function updateDiscordStatus(data) {
    if (!data || !data.discord_user || !data.discord_user.username) {
        discordWidget.innerHTML = `<div class="discord-info-wrapper" style="padding: 10px;">Cannot fetch Discord data. Check User ID or Lanyard status.</div>`;
        return;
    }
    const username = data.discord_user.username;
    const { discord_status, activities, discord_user } = data;
    const avatarHash = discord_user.avatar;
    const userId = discord_user.id;
    let userAvatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=64`;
    const statusText = discord_status.charAt(0).toUpperCase() + discord_status.slice(1);
    let statusColor = '#949ba4';
    if (discord_status === 'online') statusColor = '#09ff00ff';
    else if (discord_status === 'idle') statusColor = '#ffc400ff';
    else if (discord_status === 'dnd') statusColor = '#ff0000ff';

    const presence = activities.find(a => a.type === 0 || a.type === 4 || a.type === 2);
    let activityInfoHtml = '';
    let richPresenceIconHtml = '';

    if (presence) {
        const assets = presence.assets;
        const largeImageKey = assets ? assets.large_image : null;
        let imageUrl = '';
        if (largeImageKey) {
            if (largeImageKey.startsWith('spotify:')) {
                imageUrl = largeImageKey.replace('spotify:', 'https://i.scdn.co/image/');
            } else if (presence.application_id) {
                imageUrl = `https://cdn.discordapp.com/app-assets/${presence.application_id}/${largeImageKey}.png`;
            }
        }
        const activityType = presence.type === 0 ? 'Playing' : (presence.type === 2 ? 'Listening to' : (presence.name === 'Custom Status' ? '' : presence.name));
        const activityName = presence.name === 'Custom Status' ? (presence.state || 'Custom Status') : presence.name;
        const activityDetails = presence.details || '';
        const activityState = presence.state && presence.name !== 'Custom Status' ? presence.state : (presence.details && presence.name !== 'Custom Status' ? '' : '');

        activityInfoHtml = `
            <div class="activity-info">
                ${activityType ? `<div class="activity-type">${activityType}</div>` : ''}
                <div class="activity-name">${activityName}</div>
                <div class="activity-details">${activityDetails}</div>
                ${activityState ? `<div class="activity-state">${activityState}</div>` : ''}
            </div>
        `;
        let iconToDisplay = '';
        if (imageUrl) {
            iconToDisplay = `<img src="${imageUrl}" alt="Activity Icon" class="activity-icon">`;
        } else {
            iconToDisplay = `<img src="media/pngtree-question-mark-vector-icon-png-image_696419.jpg" alt="Default Activity Icon" class="activity-icon">`;
        }
        richPresenceIconHtml = `
            <div class="activity-icon-container">
                ${iconToDisplay}
            </div>
        `;
    } else {
      
        let statusDetail = '';
        if (discord_status === 'online') {
            statusDetail = 'currently doing nothing';
        } else if (discord_status === 'dnd') {
            statusDetail = 'currently doing nothing';
        } else if (discord_status === 'idle') {
            statusDetail = 'currently doing nothing';
        } else {
            statusDetail = 'currently doing nothing';
        }
        
        activityInfoHtml = `
            <div class="activity-info">
                <div class="activity-type">${statusText}</div>
                <div class="activity-details">${statusDetail}</div> 
            </div>
        `;
        richPresenceIconHtml = '';
    }

    discordWidget.innerHTML = `
        <div class="discord-avatar-container">
            <img src="${userAvatarUrl}" alt="Discord Avatar" class="discord-avatar">
            <div class="avatar-frame"></div> <div class="status-indicator" style="background-color: ${statusColor};" title="Status: ${statusText}"></div>
        </div>
        <div class="discord-info-wrapper">
            <div class="discord-header-info">
                <div class="discord-username">${username}</div>
            </div>
            ${activityInfoHtml}
        </div>
        ${richPresenceIconHtml}
    `;
}

async function fetchDiscordStatus() {
    try {
        const response = await fetch(LANYARD_API_URL);
        const json = await response.json();
        if (json.success) {
            console.log("✅ Discord Data received:", json.data);
            updateDiscordStatus(json.data);
        } else {
            console.error("❌ Lanyard API returned failure:", json);
            updateDiscordStatus({});
        }
    } catch (error) {
        console.error("⚠️ Error fetching Discord status:", error);
        updateDiscordStatus({});
    }
}