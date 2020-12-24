import Vue from 'vue'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'
import './main.module.scss'

const apiServer = '';

const app = new Vue({
    el: '#app',
    components: {},
    data: {
        loading: false,
        user: null,
        lms_raiting: 0,
        lms_activity: {count: 0, learning: 0},
        progress: 0,
        urlHome: null,
        levels: {
            '0': {
                val:0,
                name: 'Beginner',
                maxRating: 100
            },
            '1': {
                val:1,
                name: 'Beginner',
                maxRating: 1000
            },
            '2': {
                val: 2,
                name: 'Master',
                maxRating: 5000
            },
            '3': {
                val: 3,
                name: 'Guru',
                maxRating: 15000
            }
        },
    },
    watch: {},
    mounted: function () {
        this.loading = true;
        // console.log('user', (window.parent || {}).baAuthUser);

        if (localStorage.getItem('jwtToken')) {
            axios.defaults.headers.common['Authorization'] =
                'Bearer ' + localStorage.getItem('jwtToken');
        }

        axios
            .get(`${apiServer}/api/v2/profile`)
            .then(function (response) {
                app.user = response.data.data;
                app.user.level = app.levels[app.user.user_field2] || {};
                const lvlNames = Object.keys(app.levels);
                let fl = false;
                app.user.nextLevel = null;
                for (const lvlName of lvlNames) {
                    if (fl) {
                        app.user.nextLevel = app.levels[lvlName];
                        fl = false;
                    }
                    if (lvlName == app.user.user_field2) {
                        fl = true;
                        app.progress = app.user.user_field1 * 100 / app.levels[lvlName].maxRating;
                    }
                    if (app.user.photo_thumb) {
                        app.user.photo_thumb = apiServer + app.user.photo_thumb;
                    }
                }
                //app.user.nextLevel = null;
                app.loading = false;
                
            })
            .then(function (response) {
                console.log(app.user.id)
                axios
                .get(`${apiServer}/api/rest.php/auth/users/` + app.user.id + `?action=get-user-activity-data`)
                .then(function (response) {
                    let res = response.data;
                    app.lms_activity.count = res.count;
                    for (const key in res.data) {
                        app.lms_activity.learning +=  (res.data[key]) ? res.data[key] : 0;
                    }
                });
            });


            axios
            .get(`${apiServer}/api/v2/users/rating/current/value`)
            .then(function (response) {
                app.urlHome = apiServer;
                app.lms_raiting = response.data.rating;
            });

            
    },
    methods: {}
});
