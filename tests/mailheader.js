var Header   = require('../mailheader').Header;

var lines = [
    'Return-Path: <helpme@gmail.com>',
    'Received: from [1.1.1.1] ([2.2.2.2])\
            by smtp.gmail.com with ESMTPSA id abcdef.28.2016.03.31.12.51.37\
            for <foo@bar.com>\
            (version=TLSv1/SSLv3 cipher=OTHER);\
            Thu, 31 Mar 2016 12:51:37 -0700 (PDT)',
    'From: Matt Sergeant <helpme@gmail.com>',
    'Content-Type: multipart/alternative;\
        boundary=Apple-Mail-F2C5DAD3-7EB3-409D-9FE0-135C9FD43B69',
    'Content-Transfer-Encoding: 7bit',
    'Mime-Version: 1.0 (1.0)',
    'Subject: Re: Haraka Rocks!',
    'Message-Id: <616DF75E-D799-4F3C-9901-1642B494C45D@gmail.com>',
    'Date: Thu, 31 Mar 2016 15:51:36 -0400',
    'To: The World <world@example.com>',
    'X-Mailer: iPhone Mail (13E233)',
];

exports.basic = {
    parse_basic: function (test) {
        test.expect(2);
        var h = new Header();
        h.parse(lines);
        test.equal(h.lines().length, 11);
        test.ok(/multipart\/alternative;\s+boundary=Apple-Mail-F2C5DAD3-7EB3-409D-9FE0-135C9FD43B69/.test(h.get_decoded('content-type')));
        test.done();
    }
}

exports.add_headers = {
    add_basic: function (test) {
        test.expect(2);
        var h = new Header();
        h.parse(lines);
        h.add('Foo', 'bar');
        test.equal(h.lines()[0], 'Foo: bar\n');
        h.add_end('Fizz', 'buzz');
        test.equal(h.lines()[12], 'Fizz: buzz\n');
        test.done();
    },
    add_utf8: function (test) {
        test.expect(2);
        var h = new Header();
        h.parse(lines);
        h.add('Foo', 'bøø');
        test.equal(h.lines()[0], 'Foo: =?UTF-8?q?b=F8=F8?=\n');
        // test wrapping
        h.add('Bar', 'bøø 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890');
        test.equal(h.lines()[0], 'Bar: =?UTF-8?q?b=F8=F8 1234567890123456789012345678901234567890123456789012345678901234567=\n 890123456789012345678901234567890?=\n');
        test.done();
    }
}
