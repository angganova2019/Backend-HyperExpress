export let cache = {
    data: new Map(),
    timers: new Map(),

    set: function (key, value, ttl = 5000) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }
        this.timers.set(key, setTimeout(() => this.del(key), ttl),
        );
        this.data.set(key, value);
    },
    get: function (key) {
        return this.data.get(key);
    },
    has: function (key) {
        return this.data.has(key);
    },
    del: function (key) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }
        this.timers.delete(key);
        return this.data.delete(key);
    },
    clear: function () {
        this.data.clear();
        for (const v of this.timers.values()) {
            clearTimeout(v);
        }
        this.timers.clear();
    },
};