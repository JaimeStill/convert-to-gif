using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidToGif.Scripts;
using VidToGif.Scripts.Extensions;
using VidToGif.Web.Extensions;
using VidToGif.Web.Models;

namespace VidToGif.Web.Controllers
{
    [Route("api/[controller]")]
    public class UploadController : Controller
    {
        private IHostingEnvironment env;

        public UploadController(IHostingEnvironment env)
        {
            this.env = env;
        }

        [HttpGet("[action]")]
        public async Task<List<UploadDetails>> GetUploads()
        {
            return await env.GetUploads();
        }

        [HttpGet("[action]")]
        public async Task<List<UploadDetails>> GetGifs()
        {
            return await env.GetGifs();
        }

        [HttpGet("[action]")]
        public Task<List<string>> GetFlagOptions()
        {
            return Task.Run(() =>
            {
                return GifExtensions.GetFlagOptions();
            });
        }

        [HttpGet("[action]")]
        public Task<List<string>> GetLogOptions()
        {
            return Task.Run(() =>
            {
                return GifExtensions.GetLogOptions();
            });
        }
        
        [HttpPost("[action]")]
        public async Task<ConsoleOutput> UploadVideo()
        {
            var file = Request.Form.Files[0];

            if (file.Length > 52428800)
            {
                throw new Exception($"The provided file is too large to upload. It must be 50 MB or less");
            }

            return await file.UploadVideo(env);
        }

        [HttpPost("[action]")]
        public async Task<ConsoleOutput> DeleteVideo([FromBody]UploadDetails model)
        {
            return await model.DeleteVideo();
        }

        [HttpPost("[action]")]
        public async Task<ConsoleOutput> ConvertToGif([FromBody]GifOptions model)
        {
            await model.GetExecPath(env);
            return await model.ConvertToGif();
        }

        [HttpPost("[action]")]
        public async Task<ConsoleOutput> DeleteGif([FromBody]UploadDetails model)
        {
            return await model.DeleteGif();
        }
        [HttpGet("[action]")]
        public async Task<ConsoleOutput> ClearAllUploads()
        {
            return await env.ClearAllUploads();
        }
    }
}
