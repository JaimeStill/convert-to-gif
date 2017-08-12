using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidToGif.Scripts;
using VidToGif.Scripts.Extensions;
using VidToGif.Web.Models;

namespace VidToGif.Web.Extensions
{
    public static class AppExtensions
    {
        public static Task<List<UploadDetails>> GetUploads(this IHostingEnvironment env)
        {
            return Task.Run(() =>
            {
                var files = new List<UploadDetails>();

                if (Directory.Exists($"{env.WebRootPath}\\uploads\\"))
                {
                    foreach (var directory in Directory.EnumerateDirectories($"{env.WebRootPath}\\uploads\\"))
                    {
                        files.AddRange(Directory.EnumerateFiles(directory).Where(x => !x.EndsWith(".gif")).Select(x => x.CastToUploadDetails()));
                    }
                }

                return files;
            });
        }
        public static Task<List<UploadDetails>> GetGifs(this IHostingEnvironment env)
        {
            return Task.Run(() =>
            {
                var files = new List<UploadDetails>();

                if (Directory.Exists($"{env.WebRootPath}\\uploads\\"))
                {
                    foreach (var directory in Directory.EnumerateDirectories($"{env.WebRootPath}\\uploads\\"))
                    {
                        files.AddRange(Directory.EnumerateFiles(directory).Where(x => x.EndsWith(".gif")).Select(x => x.CastToUploadDetails()));
                    }
                }

                return files;
            });
        }
        public static Task GetExecPath(this GifOptions model, IHostingEnvironment env)
        {
            return Task.Run(() =>
            {
                model.exec = Directory.GetFiles($"{env.WebRootPath}\\resources\\").FirstOrDefault(x => x.Contains("ffmpeg"));
            });
        }
        public static async Task<ConsoleOutput> UploadVideo(this IFormFile file, IHostingEnvironment env)
        {
            var result = new StringBuilder();
            var error = new StringBuilder();
            var output = new ConsoleOutput();

            try
            {
                var guid = Guid.NewGuid().ToString();
                var uploadUrl = $"{env.WebRootPath}\\uploads\\{guid}\\";

                Directory.CreateDirectory(uploadUrl);

                await file.WriteFile(uploadUrl);

                result.AppendLine($"{file.FileName} written to {uploadUrl}");
                output.hasError = false;
                output.result = result.ToString();
                return output;
            }
            catch (Exception ex)
            {
                error.AppendLine(ex.GetExceptionMessageChain());
                output.hasError = true;
                output.error = error.ToString();
                return output;
            }
        }
        public static Task<ConsoleOutput> DeleteVideo(this UploadDetails model)
        {
            return Task.Run(() =>
            {
                var result = new StringBuilder();
                var error = new StringBuilder();
                var output = new ConsoleOutput();

                try
                {
                    var info = new FileInfo(model.fullPath);

                    File.Delete(model.fullPath);

                    result.AppendLine($"{info.Name} successfully deleted");

                    if (info.Directory.GetFiles().Count() < 1)
                    {
                        info.Directory.Delete();
                        result.AppendLine($"{info.Directory.Name} no longer contains any files and was deleted");
                    }

                    output.hasError = false;
                    output.result = result.ToString();
                    return output;
                }
                catch (Exception ex)
                {
                    error.AppendLine(ex.GetExceptionMessageChain());
                    output.hasError = true;
                    output.error = error.ToString();
                    return output;
                }
            });
        }
        public static Task<ConsoleOutput> DeleteGif(this UploadDetails model)
        {
            return Task.Run(() =>
            {
                var result = new StringBuilder();
                var error = new StringBuilder();
                var output = new ConsoleOutput();

                try
                {
                    var info = new FileInfo(model.fullPath);

                    File.Delete(model.fullPath);

                    result.AppendLine($"{info.Name} successfully deleted");

                    if (info.Directory.GetFiles().Count() < 1)
                    {
                        info.Directory.Delete();
                        result.AppendLine($"{info.Directory.Name} no longer contains any files and was deleted");
                    }

                    output.hasError = false;
                    output.result = result.ToString();                    
                    return output;
                }
                catch (Exception ex)
                {
                    error.AppendLine(ex.GetExceptionMessageChain());
                    output.hasError = true;
                    output.error = error.ToString();
                    return output;
                }
            });
        }
        public static Task<ConsoleOutput> ClearAllUploads(this IHostingEnvironment env)
        {
            return Task.Run(() =>
            {
                var result = new StringBuilder();
                var error = new StringBuilder();
                var output = new ConsoleOutput();

                try
                {
                    var uploadUrl = $"{env.WebRootPath}\\uploads\\";
                    Directory.Delete(uploadUrl, true);
                    result.AppendLine($"Files successfully cleared from {uploadUrl}");
                    output.hasError = false;
                    output.result = result.ToString();
                    return output;
                }
                catch (Exception ex)
                {
                    error.AppendLine(ex.GetExceptionMessageChain());
                    output.hasError = true;
                    output.error = error.ToString();
                    return output;
                }
            });
        }
        public static async Task WriteFile(this IFormFile file, string uploadUrl)
        {
            using (var stream = new FileStream(uploadUrl + file.FileName, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }
        public static UploadDetails CastToUploadDetails(this string file)
        {
            var info = new FileInfo(file);
            var index = info.FullName.IndexOf("wwwroot") + 7;
            var path = info.FullName.Substring(index);

            return new UploadDetails
            {
                url = path,
                name = info.Name,
                fullPath = info.FullName
            };
        }
    }
}
