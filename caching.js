export function cache() {
    this.data = new Map();
    this.timers = new Map();

    this.set = function (key, value, ttl = 5000) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }
        this.timers.set(key, setTimeout(() => this.del(key), ttl),
        );
        this.data.set(key, value);
    };

    this.get = function (key) {
        return this.data.get(key);
    };

    this.has = function (key) {
        return this.data.has(key);
    };

    this.del = function (key) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }
        this.timers.delete(key);
        return this.data.delete(key);
    };

    this.clear = function () {
        this.data.clear();
        for (const v of this.timers.values()) {
            clearTimeout(v);
        }
        this.timers.clear();
    };
};