export const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const get_year_month_str_from_moment_obj = (moment_obj) => {
    var date = new Date(moment_obj)
    var month = ("0" + (date.getMonth() + 1)).slice(-2)
    var year_month = [date.getFullYear(), month].join("-")
    return year_month
}

export const colors = [
    '#d84315',
    '#ff8a65',
    '#ffa726',
    '#ffff00',
    '#827717',
    '#d4e157',
    '#558b2f',
    '#b2ff59',
    '#439889',
    '#64d8cb',
    '#4dd0e1',
    '#002f6c',
    '#bbdefb',
    '#9fa8da',
    '#673ab7',
    '#6a1b9a',
    '#f8bbd0',
    '#f06292',
    '#212121',
    '#e8f5e9',
    '#f4f400',
    '#87c1ad',
    '#426383',
    '#525256',
    '#7e7e83',
    '#91c491',
    '#ff904e',
    '#cccccc',
    '#6d83ff'
]

export const tags_colors = [
    'rgba(216, 67, 21, 0.9)',
    'rgba(255, 138, 101, 0.9)',
    'rgba(255, 167, 38, 0.9)',
    'rgba(255, 138, 0, 0.9)',
    'rgba(130, 119, 23, 0.9)',
    'rgba(212, 138, 87, 0.9)',
    'rgba(85, 139, 47, 0.9)',
    'rgba(178, 138, 89, 0.9)',
    'rgba(67, 152, 137, 0.9)',
    'rgba(100, 216, 203, 0.9)',
    'rgba(77, 208, 225, 0.9)',
    'rgba(0, 47, 108, 0.9)',
    'rgba(187, 138, 251, 0.9)',
    'rgba(159, 168, 218, 0.9)',
    'rgba(103, 58, 183, 0.9)',
    'rgba(106, 27, 154, 0.9)',
    'rgba(248, 187, 208, 0.9)',
    'rgba(240, 98, 146, 0.9)',
    'rgba(33, 33, 33, 0.9)',
    'rgba(232, 138, 233, 0.9)',
    'rgba(244, 138, 0, 0.9)',
    'rgba(135, 193, 173, 0.9)',
    'rgba(66, 99, 131, 0.9)',
    'rgba(82, 82, 86, 0.9)',
    'rgba(126, 126, 131, 0.9)',
    'rgba(145, 196, 145, 0.9)',
    'rgba(255, 144, 78, 0.9)',
    'rgba(204, 204, 204, 0.9)',
    'rgba(109, 131, 255, 0.9)'
]

const tags_background_colors = ["magenta", "red", "volcano", "orange", "gold", "lime", "geekblue"]

export const construct_tags_background_colors_dict = (tags) => {
    var result = {}
    if (tags.length > tags_background_colors.length) {
        result[tags[i]] = 'rgba(255, 144, 78, 0.9)'
    } 
    
    for (var i = 0; i < tags.length; i++) {
        result[tags[i]] = tags_background_colors[i]
    }
    return result;
}