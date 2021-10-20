
// Copyright (c) 2017 Intel Corporation. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const express = require('express');
const app = express();

app.use(express.static('.'));

app.listen(process.env.HTML_PORT);
console.log('The web server started on http://localhost:'+process.env.HTML_PORT);
console.log('Hopefully listening on ros webridge on port: '+process.env.ROSBRIDGE_PORT);